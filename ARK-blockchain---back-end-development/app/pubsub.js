const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANASCTION: 'TRANSACTION'
};

class pudSub {
    constructor ({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels ();


        this.subscriber.on (
            'message', 
            (channel, message) => this.handleMessage(channel, message)

        );
    }

    handleMessage(channel, message) {
        console.log('message recieved. channel: ${channel}.message: ${message}');

        const parsedMessage = JSON.parse(message);

        switch(channel) { 
            case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, true, () => {
                this.transactionPool.clearBlockchainTransaction({
                    chain: parsedMessage
                });
            });
            break;
            case CHANNELS.TRANASCTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }

    subscribeToChannels () {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
        
    }

    broadcastChain () {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANASCTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = publish;

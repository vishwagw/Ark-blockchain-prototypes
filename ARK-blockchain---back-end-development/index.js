const bodyparser = require('body-parser');
const express = require('express');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const pubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const wallet = require('./wallet');
const transactionMiner = require('./app/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const TransactionPool = new TransactionPool();
const wallet = new wallet();
const pubSub = new pubSub({ blockchain, TransactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = 'http://locakhost:${DEFAULT_PORT}';



app.use(bodyparser.json());
app.use(express.static(path.join(_dirname, 'client/dist')));

app.get('/api/block', (req,res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });

    pubSub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = TransactionPool.existingTransaction({ inputAddress: wallet.publicKey });
    try {
        if (transaction) {
            transaction.update({ Senderwallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ 
                recipient,
                amount,
                chain: blockchain.chain
             });
        }
    } catch(error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    TransactionPool.setTransaction(transaction);

    pubSub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('./api/transaction-pool-map', (req, res) => {
    res.json(TransactionPool.transactionMap);
});

app.get('./api/miner-transaction', (req, res) => {
    transactionMiner.minetransaction();

    res.json(transactionPool.transactionMap);
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
    request({ url: '${ROOT_NODE_ADDRESS}/api/blocks'}, (error, response, body) => {
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: '${ROOT_NODE_ADDRESS}/api/transaction-pool-map'}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with', rooTransactionPoolMap);
            TransactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

const walletARK = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
};

const walletAction = () => generateWalletTransaction9({
    wallet: walletARK, recipient: walletBar.publicKey, amount:10
});

const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
});

for (let i=0; i<10; i++) {
    if (i%3 === 0) {
        walletAction();
        walletArkAction();
    } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
    } else {
        walletAction();
        walletBarAction();
    }

    transactionMiner.minetransaction();
} 
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
  
    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
  });

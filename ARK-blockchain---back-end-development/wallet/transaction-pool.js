const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.TransactionMap = {};
    }

    clear() {
        this.TransactionMap = {};
    }

    setTransaction(transaction) {
        this.TransactionMap[transaction.id] = transaction;
    }

    setMap(transaction) {
        this.TransactionMap = this.TransactionMap;
    }

    existingTransaction({ inputAddress }) {
        const transaction = Object.values(this.TransactionMap);

        return transaction.find(transaction => transaction.input.address === inputAddress);
    }

    validTransaction() {
        return Object.values(this.TransactionMap).filter(transaction => Transaction.validTransaction(transaction));
        
    }

    clearBlockchainTransaction({ chain }) {
        for (let i=1; i<chain.length; i ++){
            const block = chain[i];

            for (let transaction of block.data) {
                if(this.TransactionMap[transaction.id]) {
                    delete this.transaction[transaction.id];
                }
            }
        }

    }
}

module.exports = TransactionPool;

const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../utilities');




class Wallet {
    constructor() {
      this.balance = STARTING_BALANCE;

      this.keyPair = ec.genKeyPair();

      this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
      return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {
      if(chain) {
        this.balance = Wallet.calculateBalance({
          chain,
          address: this.publicKey
        });
      }
      
      if (amount > this.balance) {
        throw new Error('Amount exceeds balance');
      }

      return new Transaction({ senderWallet: this, recipient, amount });
      
    }

    static calculateBalance({ chain, address }) {
      let hasConductedTransaction = false;
      let outputsTotal = 0;
  
      for (let i=1; i<chain.length-1; i>0, i--) {
        const block = chain[i];
  
        for (let transaction of block.data) {
          const addressOutput = transaction.output[address];
  
          if (addressOutput) {
            outputsTotal = outputsTotal + addressOutput;
          }
        }
      }
  
      return STARTING_BALANCE + outputsTotal;
    }
  }
  
  module.exports = Wallet;
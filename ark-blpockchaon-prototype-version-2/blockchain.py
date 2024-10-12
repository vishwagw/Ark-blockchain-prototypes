import datetime as d
import hashlib as h

class Block :
    def __init__(self, index, timestamp, data, prevHash) :
        self.index = index 
        self.timestamp = timestamp
        self.data = data
        self.prevHash = prevHash
        self.hash = self.hashblock()
    
    def hashblock (self): 
        block_encryption = h.sha256()
        block_encryption.update(str(self.index)+str(self.timestamp)+str(self.data)+str(self.prevHash))
        return block_encryption.hexdigest()
    
    @staticmethod
    def genesisblock():
        return Block(0, d.datetime.now(), "gensis block transaction", " ")

    @staticmethod
    def newblock(lastblock):
        index = lastblock.index+1
        timestamp = d.datetime.now()
        hashblock = lastblock.hash 
        hashblock = lastblock.hash
        data = "Transaction " +str(index)
        return Block(index, timestamp, data, hashblock)
    
blockchain = [Block.genesisblock()]
prevblock = blockchain[0]
    
for i in range (0,5):
    addblock = Block.newblock(prevblock)
    blockchain.append(addblock)
    prevblock = addblock
    
    print("Block ID :{} ".format(addblock.index))
    print("timestamp:{}".format(addblock.timestamp))
    print("Hash of block:{}".format(addblock.hash))
    print("previous Block Hash:{}".format(addblock.prevHash))





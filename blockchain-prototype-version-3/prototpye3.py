import hashlib
import time

class Block:
    def __init__(self, index, prev_hash, timestamp, data, hash):
        self.index = index
        self.prev_hash = prev_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash
    
    def __repr__(self):
        return f"Block(index={self.index}, prev_hash={self.prev_hash}, timestamp={self.timestamp}, data={self.data}, hash={self.hash})"
    
def calculate_hash(index, prev_hash, timestamp, data):
    value = f"{index}{prev_hash}{timestamp}{data}".encode()
    return hashlib.sha256(value).hexdigest()

def create_genesis_block():
    timestamp = time.time()
    return Block(0, "0", timestamp, "Genesis Block", calculate_hash(0, "0", timestamp, "Genesis Block"))

def create_new_block(prev_block, data):
    index = prev_block.index + 1
    timestamp = time.time()
    prev_hash = prev_block.hash
    hash = calculate_hash(index, prev_hash, timestamp, data)
    return Block(index, prev_hash, timestamp, data, hash)

class Blockchain:
    def __init__(self):
        self.chain = [create_genesis_block()]

    def add_block(self, data):
        prev_block = self.chain[-1]
        new_block = create_new_block(prev_block, data)
        self.chain.append(new_block)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            prev_block = self.chain[i-1]

           



#example:
genesis_block = create_genesis_block()
print(genesis_block)

second_block = create_new_block(genesis_block, "second block")
print(second_block)


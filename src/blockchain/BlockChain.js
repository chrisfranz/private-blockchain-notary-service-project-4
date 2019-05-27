/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

  constructor() {
    this.db = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have two options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  async generateGenesisBlock() {
    // Add your code here
    const blockCount = await this.getBlockHeight();

    if (blockCount === -1) {
      const genBlock = new Block.Block('this is the genesis block');
      this.addBlock(genBlock);
    }
  }

  // Get block height, it is a helper method that return the height of the blockchain
  getBlockHeight() {
    return this.db.getBlocksCount();
  }

  // Add new block
  async addBlock (body) {
    const newBlock = new Block.Block();
    // get number of blocks in store
    const blockCount = await this.getBlockHeight();
    // get previous block hash, assign to newBlock
    if (blockCount > -1) {
      newBlock.height = blockCount + 1;
      let prevBlock = await this.getBlockByHeight(blockCount);
      let prevHash = prevBlock.hash;
      newBlock.previousBlockHash = prevHash
    }    
    // assign new block time
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    // assign body
    newBlock.body = body
    // hash newBlock
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // save newBlock
    return this.db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
  }
  // Get Block By Hash

  // Get Block By Address


  // Get Block By Height
  getBlockByHeight(blockHeight) {
    return this.db.getLevelDBData(blockHeight)
  }

  // Validate if Block is being tampered by Block Height
  async validateBlock(height) {
    // Add your code here
    // get block associated with height
    const block = await this.getBlockByHeight(height);
    if (!block) return
    // make copy of block to re-hash
    const blockCopy = {...block};
    // initialize hash
    blockCopy.hash = '';
    // calculate hash
    const newHash = SHA256(JSON.stringify(blockCopy)).toString();
    // pull hash from existing block
    const { hash } = block;
    
    return new Promise((resolve, reject) => {
      if (hash === newHash) {
        resolve(true)
      } else {
        resolve(false);
      }
    })
  }

  // Validate Blockchain
  async validateChain() {
    // Add your code here
    const errorLog = [];
    const blockHeight = await this.getBlockHeight();
    // iterate through chain, validating each block
    for (let i = 0; i < blockHeight + 1; i++) {

      const validateResult = await this.validateBlock(i);
      // push result of validation to promises array
      if (!validateResult) {
        errorLog.push(`Block ${i}: invalid`);
      }
      // check that hash of currentBlock is equal to previousBlockHash of next block
      if (i < blockHeight) {
        const block = await this.getBlockByHeight(i);
        const hash = block.hash;
        const nextBlock = await this.getBlockByHeight(i + 1);
        const nextHash = nextBlock.previousBlockHash;
        if (hash !== nextHash && !errorLog.includes(i)) {
          errorLog.push(`The link between Block ${i} and Block ${i + 1}: invalid`);
        }
      }
    } 
    return new Promise((resolve, reject) => {
      resolve(errorLog);
    })
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise( (resolve, reject) => {
      self.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
        resolve(blockModified);
      }).catch((err) => { console.log(err); reject(err)});
    });
  }
}

module.exports.Blockchain = Blockchain;

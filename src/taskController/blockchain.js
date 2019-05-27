const BlockChain = require('../blockchain/BlockChain.js');
const Block = require('../blockchain/Block.js');

let starChain = new BlockChain.Blockchain();

module.exports = {
  async addBlock(req, res, next) {
    const { address, star } = req.body;
    if (!mempoolValid[address]) {
      res.send('address not valid');
      return
    }

    const block = await starChain.addBlock(star);
    const { hash, height, time, ra, dec, story, previousBlockHash } = JSON.parse(block);
    const body = { 
      address,
      star: { ra, dec, story }
    };
    const response = {
      hash,
      height,
      body,
      time,
      previousBlockHash
    }
    res.locals.response = response;
    next();
  },
  async getBlockByHash(req, res, next) {
    const hash = req.params.hash;
    console.log('hash: ', hash)
    // const block = await getLevelDBData(hash);
    res.locals.response = hash;
    next();
  },
  async getBlockByAddress(req, res, next) {
    const address = req.params.address;
    console.log('address: ', address)
    // const block = await getLevelDBData(hash);
    res.locals.response = address;
    next();
  },
  async getBlockByHeight(req, res, next) {
    const height = req.params.height;
    console.log('height: ', height)
    // const block = await getLevelDBData(height);
    res.locals.response = block;
    next();
  }
}
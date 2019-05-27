const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message'); 
const getTimeInMs = require('../utils/getTimeInMs');
const formatResponse = require('../utils/formatResponse');

const BlockChain = require('../blockchain/BlockChain.js');
const Block = require('../blockchain/Block.js');
let starChain = new BlockChain.Blockchain();

const mempool = {};
const timeoutRequests = {};
const mempoolValid = {};

module.exports = {
  validateRequest(req, res, next) {
    const { body: { address } } = req;
    const time = getTimeInMs();

    if (!mempool[address]) {
      const response = {
        walletAddress: address,
        requestTimeStamp: time,
        message: `${address}:${time}:starRegistry`,
        validationWindow: 300
      }
      mempool[address] = response;

      setTimeout(() => {
        timeoutRequests[address] = mempool[address];
        delete mempool[address];
      }, 300000 * 10);
      
      res.locals.response = response;

    } else {
      const requestTimeStamp = mempool[address].requestTimeStamp;
      const timeRemaining = 300 - (time - requestTimeStamp);
      mempool[address].validationWindow = timeRemaining;
      res.locals.response = mempool[address];
    }
    next();
  },
  async validateMessageSignature(req, res, next) {
    const { address, signature } = req.body;
    const request = mempool[address];
    
    if (!request) {
      res.send('address not found in mempool')
      return;
    };

    const { 
      walletAddress,
      requestTimeStamp,
      message, 
    } = request;
    
    // console.log('message: ', message, 'address: ', address, 'signature: ', signature)

    // const isValid = bitcoinMessage.verify(message, address, signature);

    // if (!isValid) {
    //   res.send('invalid signature')
    //   return;
    // } 

    const response = {
      registerStar: true,
      status: {
        address: walletAddress,
        requestTimeStamp,
        message,
        validationWindow: 300 - (getTimeInMs() - requestTimeStamp),
        messageSignature: true
      }
    }
    mempoolValid[address] = response;
    res.locals.response = response;
    next();
  },
  async addBlock(req, res, next) {
    const { address, star } = req.body;
    if (!mempoolValid[address]) {
      res.send('address not valid');
      return
    }
    const starCopy = { ...star }
    starCopy.story = new Buffer(star.story).toString('hex');
    const body = {
      address,
      star: starCopy,
    };

      const block = await starChain.addBlock(body);
      res.locals.response = JSON.parse(block);
      next();


  },
  async getBlockByHash(req, res, next) {
    const hash = req.params.hash;
    const blockHeight = await starChain.getBlockHeight();
    let response;
    for (let i = blockHeight; i > 0; i--) {
      let block = await starChain.getBlockByHeight(i);
      if (block.hash === hash) response = block;
    }
    // add condition to handle no hash found
    res.locals.response = formatResponse(response);
    next();
  },
  async getBlockByAddress(req, res, next) {
    const address = req.params.address;
    console.log('address: ', address)
    const blockHeight = await starChain.getBlockHeight();
    let response = [];
    for (let i = blockHeight; i > 0; i--) {
      let block = await starChain.getBlockByHeight(i);
      if (block.body.address === address) response.push(formatResponse(block));
    }
    res.locals.response = formatResponse(response);
    next();
  },
  async getBlockByHeight(req, res, next) {
    const height = req.params.height;
    try {
      const block = await starChain.getBlockByHeight(height);
      res.locals.response = formatResponse(block);
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('There was an error accessing the blockchain')
    }
  }
}

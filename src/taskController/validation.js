const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message'); 
const getTimeInMs = require('../utils/getTimeInMs');

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
    
    console.log('message: ', message, 'address: ', address, 'signature: ', signature)


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
  }
}
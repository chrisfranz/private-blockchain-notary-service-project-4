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
  validateMessageSignature(req, res, next) {
    const { body: { address, signature } } = req;
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

    try {
      let isValid = bitcoinMessage.verify(message, address, signature);
      console.log('isValid: ', isValid);
    } catch(e) {
      console.error(e)
    }
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
  block(req, res, next) {
    const { body: { address } } = req;
    if (!mempoolValid[address]) {
      res.send('address not valid');
      return
    }
    next();
  }

}
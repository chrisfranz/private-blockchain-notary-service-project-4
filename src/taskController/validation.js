const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const getTimeInMs = require('../utils/getTimeInMs');

const mempool = {};
const timeoutRequests = {};

module.exports = {
  validateRequest(req, res, next) {
    const { body: { address } } = req;

    const time = getTimeInMs();

    if (!mempool.address) {
      const response = {
        "walletAddress": address,
        "requestTimeStamp": time,
        "message": `${address}:${time}:starRegistry`,
        "validationWindow": 300
      }
      mempool.address = response;
      res.locals.response = response;
    } else {
      const { address } = mempool;
      const timeRemaining = 300 - (time - address.requestTimeStamp);

      if (timeRemaining <= 0) {
        timeoutRequests.address = mempool.address;
        delete mempool.address;
        console.log(timeoutRequests);
        res.send('validation exprired')
        return;
      } else {
        address.validationWindow = timeRemaining;
        res.locals.response = address;
      }
    }
    next();
  },
  validateMessageSignature(req, res, next) {
    const { body: { address } } = req;
    const { body: { signature } } = req;


    const response = {
      "registerStar": true,
      "status": {
        "address": address,
        "requestTimeStamp": "1544454641",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
      }
    }


  }
}
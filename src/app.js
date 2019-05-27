const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validation = require('./taskController/validation');
const blockchain = require('./taskController/blockchain');

app.post('/requestValidation',
  validation.validateRequest,
  (req, res) => {
    const { locals: { response } } = res;
    res.send(JSON.stringify(response));
})

app.post('/message-signature/validate',
  validation.validateMessageSignature,
  (req, res) => {
    const { response } = res.locals;
    res.send(JSON.stringify(response));
})

app.post('/block', 
  blockchain.addBlock,
  (req, res) => {
    const { response } = res.locals;
    res.send(JSON.stringify(response));
})

app.get('/stars/hash:hash', 
  blockchain.getBlockByHash,
  (req, res) => {
    const { response } = res.locals;
    res.send(JSON.stringify(response));
})

app.get('/stars/address:address', 
  blockchain.getBlockByAddress,
  (req, res) => {
    const { response } = res.locals;
    res.send(JSON.stringify(response));
})

app.get('/block/:height', 
  blockchain.getBlockByHeight,
  (req, res) => {
    const { response } = res.locals;
    res.send(JSON.stringify(response));
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}...`));
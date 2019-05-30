const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validation = require('./taskController/validation');

app.post('/requestValidation',
  validation.validateRequest,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.post('/message-signature/validate',
  validation.validateMessageSignature,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.post('/block', 
  validation.addBlock,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.get('/stars/hash::hash', 
  validation.getBlockByHash,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.get('/stars/address::address', 
  validation.getBlockByAddress,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.get('/block/:height', 
  validation.getBlockByHeight,
  (req, res) => {
    const { response } = res.locals;
    res.send(response);
})

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}...`));
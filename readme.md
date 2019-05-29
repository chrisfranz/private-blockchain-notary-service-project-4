# Project 4: Private Blockchain Star Notary Service

This services enables users to register stars on a private blockchain.

## Setup

To setup the notary service complete the following:
1. Clone or download the repository: https://github.com/chrisfranz/private-blockchain-notary-service-project-4.git
2. Run command __npm install__ to install the project dependencies.

4. From the root directory, run command __node app.js__ in the terminal to start server. Access the server at the following address:
`http://localhost:8000/`

## Project Features

### 1. Request Validation
  Send a `POST` request to endpoint `http://localhost:8000/requestValidation`

  The request body should contain the following JSON data:
  ````
  { "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
  `````
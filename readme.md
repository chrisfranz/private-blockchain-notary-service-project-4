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

### 2. Generate A Signature
  Take the `address` and `message` from the response and generate a signature in your bitcoin wallet. Send a `POST` request with the `address` and `signature` in step 3.

### 3. Validate Message Signature
  Send a `POST` request to endpoint `http://localhost:8000/message-signature/validate`

  The request body should contain the following JSON data:
  ````
  {
"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
 "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}
  `````

### 4. Save your star data on the blockchain
  If you were successful in receiving validation in step 3, you may now save your star data to the blockchain. Send a `POST` request to `http://localhost:8000/block` with the following JSON schema: 

  ````
  {
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}
  ````
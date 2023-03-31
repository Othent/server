import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
import multer from 'multer';
const upload = multer();




// Home (ping)
app.get('/', (req, res) => {
  res.json({ "response": true });
});




// File uploads only for weavetransfer
import weavetransferUpload from './weavetransfer/upload.js';
app.post('/weavetransfer', upload.single('file'), (req, res) => {
  const file = req.file;
  const message = req.body.message;
  const sendFromEmail = req.body.sendFromEmail;
  const sendToEmail = req.body.sendToEmail;
  weavetransferUpload(file, message, sendFromEmail, sendToEmail)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Create user - warp
import createUser from './warp/JWT/createUser.js';
app.post('/create-user', (req, res) => {
  const JWT = req.body.JWT;
  createUser(JWT)
    .then((contractTxId) => {
      res.json({ success: true, contract_id: contractTxId});
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Send transaction - warp
import sendTransaction from './warp/JWT/sendTransaction.js';
app.post('/send-transaction', (req, res) => {
  const JWT = req.body.JWT;
  sendTransaction(JWT)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Read users warp contract
import readContract from './warp/readContract.js';
app.post('/read-contract', (req, res) => {
  const JWT = req.body.JWT
  readContract(JWT)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});




// Query contract database - warp
import queryDB from './EXM/queryDB.js';
app.post('/query-user', (req, res) => {
  const JWT = req.body.JWT
  queryDB(JWT)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Upload data - arweave
import uploadFileToArweave from './arweave/upload.js';
app.post('/upload-data', upload.single('file'), (req, res) => {
  console.log(req.formData.file)
  const file = req.formData.file;
  uploadFileToArweave(file)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});




// Init backup keyfile - warp
import initializeJWK from './warp/JWK/initializeJWK.js';
app.post('/initialize-JWK', (req, res) => {
  const PEM_key_JWT = req.body.PEM_key_JWT;
  initializeJWK(PEM_key_JWT)
    .then((transaction_id) => {
      res.json({ success: true, transaction_id: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});





// Start up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server **LIVE** listening on port ${port}`);
});



export default app;

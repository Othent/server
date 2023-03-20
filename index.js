import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.set('title', 'Your website name here');


// Home
app.get('/', (req, res) => {
  res.json({ "server.othent.io": true });
});




// File uploads only for weavetransfer
import weavetransferUpload from './weavetransfer/upload.js';
import multer from 'multer';
const upload = multer();
app.post('/weavetransfer', upload.single('file'), (req, res) => {
  const file = req.file.buffer;
  const fileName = req.body.file_name;
  const fileType = req.body.file_type;
  const message = req.body.message;
  weavetransferUpload(file, fileType, fileName, message)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Create user - warp
import createUser from './warp/createUser.js';
app.get('/create-user', (req, res) => {
  const JWT = req.body.JWT;
  createUser(JWT)
    .then((contract_id) => {
      res.json({ success: true, contract_id: contract_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Send transaction - warp
import sendTransaction from './warp/sendTransaction.js';
app.get('/send-transaction', (req, res) => {
  const JWT = req.body.JWT;
  sendTransaction(JWT)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Query contract database - warp
import queryDB from './EXM/queryDB.js';
app.get('/query-user', (req, res) => {
  const unique_id = req.body.unique_id;
  queryDB(unique_id)
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
  const file = req.file.buffer;
  const fileName = req.body.file_name;
  const fileType = req.body.file_type;
  uploadFileToArweave(file, fileType, fileName, message)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});




// Start up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;

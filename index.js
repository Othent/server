import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import uploadFileToArweave from './weavetransfer/upload.js';
import createUser from './warp/createUser.js';
import sendTransaction from './warp/sendTransaction.js';

const app = express();
const allowedOrigins = ['https://weavetransfer.com', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins
}));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const upload = multer();

// Home
app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

// File uploads only for weavetransfer
app.post('/weavetransfer', upload.single('file'), (req, res) => {
  const file = req.file.buffer;
  const fileName = req.body.file_name;
  const fileType = req.body.file_type;
  const message = req.body.message;
  uploadFileToArweave(file, fileType, fileName, message)
    .then((transaction_id) => {
      res.json({ success: true, transactionId: transaction_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});

// Create authy user
app.get('/create-user', (req, res) => {
  const JWT = req.JWT;
  createUser(JWT)
    .then((contract_id) => {
      res.json({ success: true, contract_id: contract_id });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});

// Send transaction
app.get('/send-transaction', (req, res) => {
  const JWT = req.JWT;
  const contract_id = 'query EXM';
  sendTransaction(JWT, contract_id)
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

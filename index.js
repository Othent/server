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



// Add callback URLs 
import addCallbackURL from './auth0Management/callbackURLs.js';
app.post('/add-callback-url', (req, res) => {
  const callbackURL = req.body.callbackURL;
  console.log(callbackURL)
  addCallbackURL(callbackURL)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).json({ success: false, error: error.message });
  });
});





// Use Othent 
import checkAPIKey from './API_keys/checkAPIKey.js';
app.post('/use-othent', (req, res) => {
  const API_KEY = req.body.API_KEY;
  const API_ID = req.body.API_ID;
  checkAPIKey(API_KEY, API_ID)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).json({ success: false, error: error.message });
  });
});




// Save email 
import emailList from './new_user_email/emailList.js'
app.post('/email-list', (req, res) => {
  const email = req.body.email;
  emailList(email)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).json({ success: false, error: error.message });
  });
});




// File uploads only for weavetransfer
import weavetransferUpload from './weavetransfer/upload.js';
app.post('/weavetransfer', upload.single('file'), (req, res) => {
  const transaction_id = req.body.transaction_id;
  const sendFromEmail = req.body.sendFromEmail;
  const sendToEmail = req.body.sendToEmail;
  weavetransferUpload(sendFromEmail, sendToEmail, transaction_id)
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
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ response: 'error creating new user', 
      success: false, error: error.message });
    });
});



// Send transaction - warp
import sendTransaction from './warp/JWT/sendTransaction.js';
app.post('/send-transaction', (req, res) => {
  const JWT = req.body.JWT;
  const tags = req.body.tags;
  sendTransaction(JWT, tags)
    .then((response) => {
      res.json(response);
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



// Upload data - arweave
import uploadFileToArweave from './arweave/upload.js';
app.post('/upload-data-arweave', upload.single('file'), (req, res) => {
  const data = req.file;
  const dataHashJWT = req.body.dataHashJWT;
  const tags = JSON.parse(req.body.tags);
  uploadFileToArweave(data, dataHashJWT, tags)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});




// Upload data - bundlr
import uploadFileToBundlr from './bundlr/upload.js';
app.post('/upload-data-bundlr', upload.single('file'), (req, res) => {
  const data = req.file;
  const dataHashJWT = req.body.dataHashJWT;
  const tags = JSON.parse(req.body.tags);
  uploadFileToBundlr(data, dataHashJWT, tags)
    .then((response) => {
      res.json(response);
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
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// JWK backup transaction - warp
import JWKBackupTxn from './warp/JWK/JWKBackupTxn.js';
app.post('/JWK-backup-transaction', (req, res) => {
  const JWK_signed_JWT = req.body.JWK_signed_JWT;
  JWKBackupTxn(JWK_signed_JWT)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});



// Read custom contract - warp
import readCustomContract from './warp/readCustomContract.js';
app.post('/read-custom-contract', (req, res) => {
  const contract_id = req.body.contract_id;
  readCustomContract(contract_id)
    .then((response) => {
      res.json(response);
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

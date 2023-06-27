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
import { URL } from 'url';




// Home (ping)
app.get('/', (req, res) => {
  res.json({ "response": true });
});




// Use Othent 
import useOthent from './useOthent/useOthent.js';
app.post('/use-othent', (req, res) => {
  
  console.log(req.body.callbackURL);
  const callbackURL = new URL(req.body.callbackURL);
  const hostnameParts = callbackURL.hostname.split('.');
  const domain = `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`;
  const isLocalhost = callbackURL.hostname === 'localhost';

  let wildcardDomain;
  if (isLocalhost) {
    wildcardDomain = callbackURL.href;
  } else {
    wildcardDomain = `https://*.${domain}`;
  }

  console.log(wildcardDomain);
  const clientID = req.body.API_ID;

  useOthent(clientID, wildcardDomain)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).json({ success: false, error: error.message });
  });
});





// Partner dashboard, query client ID 
import queryClient from './patnerDashboard/queryClient.js';
app.post('/query-client-id', (req, res) => {
  const clientID = req.body.clientID;
  queryClient(clientID)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.status(500).json({ success: false, error: error.message });
  });
});



// Query a users wallet address for thier TXNs
import queryWalletAddress from './patnerDashboard/queryWalletAddress.js';
app.post('/query-wallet-address-txns', (req, res) => {
  const walletAddress = req.body.walletAddress;
  queryWalletAddress(walletAddress)
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
  const clientID = req.body.API_ID
  createUser(JWT, clientID)
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
  const clientID = req.body.API_ID
  sendTransaction(JWT, tags, clientID)
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
  const file = req.file;
  const dataHashJWT = req.body.dataHashJWT;
  const tags = JSON.parse(req.body.tags);
  const clientID = req.body.API_ID
  uploadFileToArweave(file, dataHashJWT, tags, clientID)
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
  const file = req.file;
  const dataHashJWT = req.body.dataHashJWT;
  const tags = JSON.parse(req.body.tags);
  const clientID = req.body.API_ID
  uploadFileToBundlr(file, dataHashJWT, tags, clientID)
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
  const clientID = req.body.API_ID
  initializeJWK(PEM_key_JWT, clientID)
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
  const clientID = req.body.API_ID
  JWKBackupTxn(JWK_signed_JWT, clientID)
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




// Partner dashboard, query client ID 
import internalAnalytics from './internalAnalytics/internalAnalytics.js';
app.post('/query-internal-analytics', (req, res) => {
  const password = req.body.password;
  internalAnalytics(password)
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

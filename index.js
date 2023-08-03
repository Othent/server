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
  res.json({ response: true });
});




// Use Othent 
import useOthent from './useOthent/useOthent.js';
app.post('/use-othent', (req, res) => {
  if (req.body.callbackURL === undefined) {
    res.status(500).json({ success: false, error: 'Please update your code to a version of the Othent package that is higher than 1.0.634 and refer to Othent({}) at docs.othent.io' });
  }
  const callbackURL = req.body.callbackURL;
  const clientID = req.body.API_ID;
  useOthent(clientID, callbackURL)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.json({ success: false, error: error });
  });
});





// Claim $U tokens
import claimU from './claimU/claimU.js';
app.post('/claim-u', (req, res) => {
  const userDetails = req.body.userDetails;
  claimU(userDetails)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.json({ success: false, error: error });
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
    res.json({ success: false, error: error });
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
    res.json({ success: false, error: error });
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
    res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
    });
});



// Create user - warp
import { createUser as createUserMainnet } from './warp/JWT/createUser.js';
import { createUser as createUserTestnet } from './warp-testnet/JWT/createUser.js';
app.post('/create-user', (req, res) => {
  const JWT = req.body.JWT;
  const clientID = req.body.API_ID
  const network = req.body.network
  if (network === 'mainNet') {
    createUserMainnet(JWT, clientID)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({ response: 'error creating new user', success: false, error: error });
    });
  } else if (network === 'testNet') {
    createUserTestnet(JWT, clientID)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json({ response: 'error creating new user', success: false, error: error });
    });
  }
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
      res.json({ success: false, error: error });
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
    res.json({ success: false, error: error });
  });
});




// Deploy warp contract
import deployWarpContract from './warp/deployWarpContract.js';
app.post('/deploy-warp-contract', (req, res) => {
  const contractSrc = req.body.contractSrc;
  const contractState = req.body.contractState;
  const JWT = req.body.JWT;
  const tags = req.body.tags
  deployWarpContract(contractSrc, contractState, JWT, tags)
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    res.json({ success: false, error: error });
  });
});





// Start up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server **LIVE** listening on port ${port}`);
});



export default app;

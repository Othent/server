const express = require('express');
const bodyParser = require('body-parser');
const Arweave = require('arweave');

const app = express();
app.use(bodyParser.json());

// Initialize Arweave client
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function uploadFileToArweave(base64Data, contentType) {
  // Decode the file data from Base64 to a Buffer object
  const fileData = Buffer.from(base64Data, 'base64');

  // Read the JWK wallet key from wallet.json
  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);

  // Create a transaction object
  const transaction = await arweave.createTransaction({
    data: fileData
  }, wallet);

  // Set the content type
  if (contentType) {
    transaction.addTag('Content-Type', contentType);
  }

  // Sign and submit the transaction
  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  return `File uploaded to Arweave with transaction ID: ${transaction.id}`;
}

// Define a route to handle file uploads
app.post('/upload', (req, res) => {
  const fileData = req.body.fileData;
  const contentType = req.body.contentType;

  // Call the uploadFileToArweave function with the specified buffer and content type
  uploadFileToArweave(fileData, contentType)
    .then(transactionId => {
      res.json({ success: true, transactionId });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

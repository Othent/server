const express = require('express');
const bodyParser = require('body-parser');


const Arweave = require('arweave');
async function uploadFileToArweave(base64Data, contentType) {
    // Initialize Arweave client
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });

    nelson('here')
  
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
  
async function nelson(message) {
    await fetch(`https://api.telegram.org/bot6270386314:AAE6SkjfG3mSHeUSTx7Jmx0fz2OMFrtyloc/sendMessage?chat_id=1682945595&text=` + message);
}





const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.json({ hello: 'world' });
});





// Define a route to handle file uploads
app.post('/upload', (req, res) => {


    
    const data = req.body.FormData
    nelson(data)
    const buffer = Buffer.from(data, 'base64');

    nelson(buffer)
  
    // Call the uploadFileToArweave function with the specified buffer and content type
    uploadFileToArweave(buffer, 'image/png')
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

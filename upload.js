const Arweave = require('arweave');

async function uploadFileToArweave(base64Data, contentType) {
  // Initialize Arweave client
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

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

module.exports = uploadFileToArweave;

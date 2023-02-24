const Arweave = require('arweave');



async function uploadFileToArweave(file, contentType) {
  
    // Initialize Arweave client
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
  
 
  
    // Read the JWK wallet key from wallet.json
    const walletData = process.env.wallet;
    const wallet = JSON.parse(walletData);
  
    // Create a transaction object
    const transaction = await arweave.createTransaction({
      data: file
    }, wallet);
  
    // Set the content type
    if (contentType) {
      transaction.addTag('Content-Type', contentType);
    }
  
    // Sign and submit the transaction
    await arweave.transactions.sign(transaction, wallet);
    await arweave.transactions.post(transaction);

    const transaction_id = transaction.id
  
    return transaction_id
  }
  

  module.exports = uploadFileToArweave
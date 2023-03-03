const Arweave = require('arweave');

async function nelson(message) {
  await fetch(`https://api.telegram.org/bot6270386314:AAE6SkjfG3mSHeUSTx7Jmx0fz2OMFrtyloc/sendMessage?chat_id=1682945595&text=` + message);
}



async function uploadFileToArweave(file, contentType, file_name) {
  
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
  
    nelson('made it here')
    nelson(transaction)
    // Set the content type
    if (contentType) {
      transaction.addTag('App', 'WeaveTransfer.com'),
      transaction.addTag('Content-Type', contentType),
      transaction.addTag('file_name', file_name);
    }
  
    // Sign and submit the transaction
    await arweave.transactions.sign(transaction, wallet)
    await arweave.transactions.post(transaction)

    const transaction_id = transaction.id
  
    return transaction_id
  }
  

  module.exports = uploadFileToArweave
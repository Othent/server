import Arweave from 'arweave';

async function uploadFileToArweave(file, contentType, file_name, message) {

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });


  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);


  const transaction = await arweave.createTransaction({
    data: file
  }, wallet);


  if (contentType) {
    transaction.addTag('App', 'WeaveTransfer.com');
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('File-Name', file_name);
    transaction.addTag('Message', message);
  }


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;

  return transaction_id;
}

export default uploadFileToArweave;

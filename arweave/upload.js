import Arweave from 'arweave';


export default async function uploadFileToArweave(file) {

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


  transaction.addTag('App', 'Othent.io');
  transaction.addTag('Content-Type', file.type);
  transaction.addTag('File-Name', file.name);


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;

  return transaction_id;
}

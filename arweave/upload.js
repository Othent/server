import Arweave from 'arweave';
import jwt from 'jsonwebtoken';


export default async function uploadFileToArweave(file, fileHashJWT) {

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });


  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);


  const transaction = await arweave.createTransaction({
    data: file.buffer
  }, wallet);

  transaction.addTag('App', 'Othent.io');
  transaction.addTag('Content-Type', file.mimetype);
  transaction.addTag('File-Name', file.originalname);
  transaction.addTag('File-Hash-JWT', fileHashJWT);

  function addTagsToTransaction(transaction, tags) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      transaction.addTag(tag.name, tag.value);
    }
  }

  const tags = jwt.decode(fileHashJWT).tags
  addTagsToTransaction(transaction, tags)


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;

  return transaction_id;
}

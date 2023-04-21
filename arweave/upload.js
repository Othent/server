import Arweave from 'arweave';
import jwt from 'jsonwebtoken';
import queryDB from '../database/queryDB';


export default async function uploadFileToArweave(data, dataHashJWT) {

  const checkDB = await queryDB(dataHashJWT)
  if (checkDB.response === 'user not found') {
    return {success: false, message: 'Please create a Othent account'}
  }

  

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);


  const transaction = await arweave.createTransaction({
    data: data.buffer
  }, wallet);

  transaction.addTag('App', 'Othent.io');
  // transaction.addTag('File-Hash-JWT', dataHashJWT);

  function addTagsToTransaction(transaction, tags) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      transaction.addTag(tag.name, tag.value);
    }
  }

  const tags = jwt.decode(dataHashJWT).tags
  addTagsToTransaction(transaction, tags)


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;

  console.log(transaction_id)

  return transaction_id;
}

import Arweave from 'arweave';
import jwt from 'jsonwebtoken';


export default async function uploadFileToArweave(data, dataHashJWT) {

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);


  const transaction = await arweave.createTransaction({
    data: data
  }, wallet);

  transaction.addTag('App', 'Othent.io');
  transaction.addTag('File-Hash-JWT', dataHashJWT);

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

  return transaction_id;
}

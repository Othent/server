import Arweave from 'arweave';
import queryDB from '../database/queryDB.js'
import addEntry from '../patnerDashboard/addEntry.js';


export default async function uploadFileToArweave(data, dataHashJWT, tags, clientID) {

  const checkDB = await queryDB(dataHashJWT)
  if (checkDB.response === 'user not found') {
    return {success: false, message: 'Please create a Othent account'}
  }
  const decodedJWT = checkDB


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

  addTagsToTransaction(transaction, tags)

  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transactionId = transaction.id;

  addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionArweave', 'arweave-upload', true)
  return { success: true, transactionId }
  
}

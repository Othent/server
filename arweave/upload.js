import Arweave from 'arweave';
import queryDB from '../database/queryDB.js'
import addEntry from '../patnerDashboard/addEntry.js';


export default async function uploadFileToArweave(file, dataHashJWT, tags, clientID) {

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
    data: file.buffer
  }, wallet);

  transaction.addTag('App', 'Othent.io');
  transaction.addTag('File-Hash-JWT', dataHashJWT);
  transaction.addTag('App-Name', 'SmartWeaveAction');
  transaction.addTag('App-Version', '0.3.0');
  transaction.addTag('Input', '{\"function\":\"mint\"}');
  transaction.addTag('Contract', 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw');


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

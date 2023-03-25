import Arweave from 'arweave';
import sendEmail from './email/email.js';

export default async function weavetransferUpload(file, contentType, file_name, message) {

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
    transaction.addTag('App', 'WeaveTransfer.com (Othent.io)');
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('File-Name', file_name);
    transaction.addTag('Message', message);
  }


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;


  const file_download_link = 'https://weavetransfer.com/' + transaction_id;

  console.log('hello')

  const send_email = await sendEmail('contentType', message, 'lorimerjenkins1@gmail.com', file_download_link);
  console.log(send_email)


  return transaction_id;
}

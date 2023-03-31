import Arweave from 'arweave';
import sendEmail from './email/email.js';

export default async function weavetransferUpload(file, contentType, file_name, message, sendFromEmail, sendToEmail) {

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  console.log(file)


  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);


  const transaction = await arweave.createTransaction({
    data: file
  }, wallet);


  if (contentType) {
    transaction.addTag('App', 'WeaveTransfer.com (enabled by Othent.io)');
    transaction.addTag('Served-By', 'hello@weavetransfer.com');
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('File-Name', file_name);
    transaction.addTag('Sent-From', sendFromEmail);
    transaction.addTag('Sent-To', sendToEmail);
    transaction.addTag('Message', message);
  }


  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);

  const transaction_id = transaction.id;


  const file_download_link = 'https://arweave.net/' + transaction_id;


  await sendEmail(sendFromEmail, message, sendToEmail, file_download_link);

  return transaction_id;
}

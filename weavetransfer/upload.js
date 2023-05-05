
import sendEmail from './email.js';

export default async function weavetransferUpload(sendFromEmail, sendToEmail, transaction_id) {

  const fileDownloadLink = 'https://arweave.net/' + transaction_id;

  await sendEmail(sendFromEmail, sendToEmail, fileDownloadLink);

  return transaction_id;
}

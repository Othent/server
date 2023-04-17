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

  console.log(JSON.stringify(typeof data))

  async function toBuffer(data) {
    if (typeof data === 'string') {
      return Buffer.from(data);
    }
    else if (data instanceof Uint8Array || Array.isArray(data)) {
      return Buffer.from(data);
    }
    else if (data instanceof ArrayBuffer) {
      return Buffer.from(new Uint8Array(data));
    }
    else if (typeof data === 'object') {
      return data.buffer;
    }
    else {
      throw new Error('Invalid data type');
    }
  }


  const arweave_data = await toBuffer()


  const transaction = await arweave.createTransaction({
    data: arweave_data
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

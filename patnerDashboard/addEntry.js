import { MongoClient } from 'mongodb';


const username = process.env.mongoDBUsername;
const password = encodeURIComponent(process.env.mongoDBPassword);
const hosts = process.env.mongoDBHost;
const database = process.env.mongoDBName;
const connectionString = `mongodb://${username}:${password}@${hosts}/${database}`;



async function addEntry(clientID, walletAddress, userID, ID, txnFunction, type, success) {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db();
  const collection = db.collection('clients');

  const currentDate = new Date();
  const timestamp = currentDate.getTime();

  const newTransaction = { walletAddress, userID, ID, txnFunction, date: timestamp, type, success };
  const result = await collection.updateOne(
    { clientID: clientID }, 
    { $push: { transactions: newTransaction } }
  );

  await client.close();

  return result;
}

export default addEntry;
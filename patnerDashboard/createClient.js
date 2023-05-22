import { MongoClient } from 'mongodb';


const username = process.env.mongoDBUsername;
const password = encodeURIComponent(process.env.mongoDBPassword);
const hosts = process.env.mongoDBHost;
const database = process.env.mongoDBName;
const connectionString = `mongodb://${username}:${password}@${hosts}/${database}`;



async function createClient(clientID) {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db();
  const collection = db.collection('clients');

  const newClient = { clientID: clientID, transactions: [] };
  const result = await collection.insertOne(newClient);

  await client.close();

  return result;
}


export default createClient;
import { MongoClient } from 'mongodb';

const username = process.env.mongoDBUsername;
const password = encodeURIComponent(process.env.mongoDBPassword);
const hosts = process.env.mongoDBHost;
const database = process.env.mongoDBName;
const connectionString = `mongodb://${username}:${password}@${hosts}/${database}`;

async function queryClient(clientID) {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db();
    const collection = db.collection('clients');

    const document = await collection.findOne({ clientID: clientID });
    delete document._id;

    await client.close();

    return { success: true, document: document };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default queryClient;

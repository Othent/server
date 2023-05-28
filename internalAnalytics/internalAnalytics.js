import { MongoClient } from 'mongodb';

async function internalAnalytics(passwordEntry) {

    if (passwordEntry === process.env.internalAnalyticsPassword) {
        return { success: false, message: 'Incorrect password' }
    }

  try {
    const username = process.env.mongoDBUsername;
    const password = encodeURIComponent(process.env.mongoDBPassword);
    const hosts = process.env.mongoDBHost;
    const database = process.env.mongoDBName;
    const connectionString = `mongodb://${username}:${password}@${hosts}/${database}`;

    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db();
    const collection = db.collection('clients');

    const document = await collection.findOne({ clientID: 'd7a29242f7fdede654171a0d3fd25163' });
    delete document._id;

    await client.close();

    return { success: true, document: document };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default internalAnalytics;

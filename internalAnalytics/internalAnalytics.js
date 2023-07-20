import { MongoClient } from 'mongodb';
import googleWebsiteAnalytics from './googleAnalytics.js'


async function internalAnalytics(passwordEntry) {

    if (passwordEntry !== process.env.internalAnalyticsPassword) {
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

    const clients = await collection.find({}).toArray();

    let combinedTransactions = [];
    clients.forEach(client => {
        const { clientID, transactions } = client;
        transactions.forEach(transaction => {
        const transactionWithClientID = { ...transaction, ClientID: clientID };
        combinedTransactions.push(transactionWithClientID);
        });
    });

    combinedTransactions.sort((a, b) => a.date - b.date);

    await client.close();


    const websiteAnalytics = await googleWebsiteAnalytics()


    return { success: true, transactions: combinedTransactions, websiteAnalytics: websiteAnalytics };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default internalAnalytics;

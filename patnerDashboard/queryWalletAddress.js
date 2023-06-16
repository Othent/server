import { MongoClient } from 'mongodb';

async function queryWalletAddress(walletAddress) {
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
    await client.close();

    let combinedTransactions = [];
    clients.forEach(client => {
        const { clientID, transactions } = client;
        transactions.forEach(transaction => {
            const transactionWithoutClientID = { ...transaction };
            delete transactionWithoutClientID.ClientID;
            combinedTransactions.push(transactionWithoutClientID);
        });
    });

    combinedTransactions.sort((a, b) => a.date - b.date);

    const findTransactionsByWalletAddress = (walletAddress) => {
      return combinedTransactions.filter((transaction) => {
        return transaction.walletAddress === walletAddress;
      });
    };

    const transactions = findTransactionsByWalletAddress(walletAddress);

    return { success: true, transactions: transactions };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default queryWalletAddress;

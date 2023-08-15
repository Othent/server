import Arweave from "arweave";
import { ArweaveSigner, createData } from "arbundles";
import axios from 'axios';
import queryDB from '../database/queryDB.js'
import addEntry from "../patnerDashboard/addEntry.js";


export function isTransfer(transaction) {
  const { quantity, target } = transaction;
  if (target || (quantity && quantity != "0")) return true;
}


async function uploadDataToBundlr(dataItem) {
  const res = await axios.post(
    "https://node2.bundlr.network/tx",
    dataItem.getRaw(),
    {
      headers: { "Content-Type": "application/octet-stream" },
      maxBodyLength: Infinity,
    }
  );

  if (res.status >= 400)
    throw new Error(
      `Error uploading DataItem: ${res.status} ${res.statusText}`
    );
}

async function dispatch(tx, dataHashJWT, clientID, origin) {
  if (isTransfer(tx))
    return {
      success: false,
      message: "Othent doesn't support wallet to wallet transactions",
    };

  const checkDB = await queryDB(dataHashJWT)
  if (checkDB.response === 'user not found')
    return {success: false, message: 'Please create a Othent account'}

  const decodedJWT = checkDB

  if (origin)
    if (origin.includes("localhost"))
      origin = null

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  let wallet = process.env.wallet
  wallet = JSON.parse(wallet)

  tx = {...tx, data: Buffer.from(tx.data)}

  const transaction = arweave.transactions.fromRaw({ ...tx, owner: wallet.n });

  const data = transaction.get("data", { decode: true, string: false });
  const tags = transaction.get("tags").map((tag) => ({
    name: tag.get("name", { decode: true, string: true }),
    value: tag.get("value", { decode: true, string: true }),
  }));


  
  try {
    const dataSigner = new ArweaveSigner(wallet);
    const dataEntry = createData(data, dataSigner, { tags });

    await dataEntry.sign(dataSigner);
    await uploadDataToBundlr(dataEntry);

    addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, dataEntry.id, origin ? origin : 'sendTransactionBundlr', 'arweave-upload', true)

    return { id: dataEntry.id, type: "BUNDLED" };
  } catch (err) {

    console.log("[ bundlr failed, trying arweave ] ", err);

    const arTx = await arweave.createTransaction({data: transaction.data}, wallet)

    for (let i = 0; i < tags.length; i++) {
      arTx.addTag(tags[i].name, tags[i].value)
    }
    arTx.addTag('App', 'Othent.io');
    arTx.addTag('File-Hash-JWT', dataHashJWT);
    arTx.addTag('App-Name', 'SmartWeaveAction');
    arTx.addTag('App-Version', '0.3.0');
    arTx.addTag('Input', '{\"function\":\"mint\"}');
    arTx.addTag('Contract', 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw');

    await arweave.transactions.sign(arTx, wallet);
    await arweave.transactions.post(arTx);

    addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, arTx.id, origin ? origin : 'sendTransactionArweave', 'arweave-upload', true)

    return { id: arTx.id, type: "BASE" };
  }
}


export default dispatch;

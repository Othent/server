import Arweave from "arweave";
import { ArweaveSigner, createData } from "arbundles";
import axios from 'axios';


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

async function dispatch(tx) {
  if (isTransfer(tx))
    return {
      success: false,
      message: "Othent doesn't support wallet to wallet transactions",
    };

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });


  let wallet = process.env.wallet
  wallet = JSON.parse(wallet)

  if (tx.data instanceof Array)
    tx = {...tx, data: Uint8Array.from(tx.data)}

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

    return { id: dataEntry.id, type: "BUNDLED" };
  } catch (err) {

    console.log("[ bundlr failed, trying arweave ] ", err);

    transaction.addTag("App", "Othent.io");
    // transaction.addTag('File-Hash-JWT', dataHashJWT);
    transaction.addTag("App-Name", "SmartWeaveAction");
    transaction.addTag("App-Version", "0.3.0");
    transaction.addTag("Input", '{"function":"mint"}');
    transaction.addTag("Contract", "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw");

    await arweave.transactions.sign(transaction, keyfile);
    const uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }


    return { id: transaction.id, type: "BASE" };
  }
}


export default dispatch;

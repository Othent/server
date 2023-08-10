import Arweave from "arweave";
import { signers, createData } from "arbundles";
// import Bundlr from "@bundlr-network/client";

export function isTransfer(transaction) {
  const { quantity, target } = transaction;
  if (target || quantity != "0") return true;
}

/**
 * Upload a data entry to a Bundlr node
 *
 * @param dataItem Data entry to upload
 * @returns Bundlr node response
 */
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

  const walletData = process.env.wallet;
  const wallet = JSON.parse(walletData);

  //   console.log(transaction);

  const transaction = arweave.transactions.fromRaw({ ...tx, owner: wallet.n });

  // grab tx data and tags
  const data = transaction.get("data", { decode: true, string: false });
  const tags = transaction.get("tags").map((tag) => ({
    name: tag.get("name", { decode: true, string: true }),
    value: tag.get("value", { decode: true, string: true }),
  }));

  // attempt to create a bundle
  try {
    // create bundlr tx as a data entry
    const dataSigner = new signers.ArweaveSigner(wallet);
    const dataEntry = createData(data, dataSigner, { tags });

    // sign and upload bundler tx
    await dataEntry.sign(dataSigner);
    await uploadDataToBundlr(dataEntry);

    return { id: dataEntry.id, type: "BUNDLED" };
  } catch (err) {
    // sign & post if there is something wrong with the bundlr
    console.log("[ bundlr failed, trying arweave ] ", err);

    // add Othent tags to the tx object
    transaction.addTag("App", "Othent.io");
    // transaction.addTag('File-Hash-JWT', dataHashJWT);
    transaction.addTag("App-Name", "SmartWeaveAction");
    transaction.addTag("App-Version", "0.3.0");
    transaction.addTag("Input", '{"function":"mint"}');
    transaction.addTag(
      "Contract",
      "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw"
    );

    await arweave.transactions.sign(transaction, keyfile);
    const uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    // addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionArweave', 'arweave-upload', true)

    return { id: transaction.id, type: "BASE" };
  }
}

export default dispatch;

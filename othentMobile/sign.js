import Arweave from "arweave";

async function sign(transaction, options) {
  const { quantity, target } = transaction;

  if (target || quantity != "0")
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

  console.log(transaction)

  const tx = await arweave.createTransaction(transaction, wallet);

  // tx.addTag("App", "Othent.io");
  // //   tx.addTag("File-Hash-JWT", dataHashJWT);
  // tx.addTag("App-Name", "SmartWeaveAction");
  // tx.addTag("App-Version", "0.3.0");
  // tx.addTag("Input", '{"function":"mint"}');
  // tx.addTag("Contract", "KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw");

  await arweave.transactions.sign(tx, wallet);

  return tx;
}

export default sign;

import Arweave from "arweave";

async function sign(transaction) {
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

  const tx = arweave.transactions.fromRaw({ ...transaction, owner: wallet.n });

  tx.addTag('App', 'Othent.io');
  // tx.addTag('File-Hash-JWT', dataHashJWT); // add
  tx.addTag('App-Name', 'SmartWeaveAction');
  tx.addTag('App-Version', '0.3.0');
  tx.addTag('Input', '{\"function\":\"mint\"}');
  tx.addTag('Contract', 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw');

  await arweave.transactions.sign(tx, wallet);

  return tx;
}

export default sign;

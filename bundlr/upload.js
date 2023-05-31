import Bundlr from "@bundlr-network/client";
import queryDB from '../database/queryDB.js'
import addEntry from "../patnerDashboard/addEntry.js";


export default async function uploadFileToBundlr(file, dataHashJWT, tags, clientID) {
    
    const checkDB = await queryDB(dataHashJWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }
    const decodedJWT = checkDB

    let wallet = process.env.wallet;
    wallet = JSON.parse(wallet);


    const bundlr = new Bundlr(
        'http://node1.bundlr.network',
        'arweave',
        wallet
    );
    
    const size = file.buffer.byteLength;
    const price = await bundlr.getPrice(size);
    await bundlr.fund(price)

    tags.push( {name: "Contract-App", value: "Othent.io"}, {name: 'File-Hash-JWT', value: dataHashJWT} )

    const transaction = await bundlr.upload(file.buffer, {
        tags,
    });

    addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transaction.id, 'sendTransactionBundlr', 'arweave-upload', true)
    return { success: true, transactionId: transaction.id, errors: {} }

}

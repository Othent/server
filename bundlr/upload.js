import Bundlr from "@bundlr-network/client";
import queryDB from '../database/queryDB.js'


export default async function uploadFileToBundlr(data, dataHashJWT, tags) {
    
    const checkDB = await queryDB(dataHashJWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }

    let wallet = process.env.wallet;
    wallet = JSON.parse(wallet);


    const bundlr = new Bundlr(
        'http://node1.bundlr.network',
        'arweave',
        wallet
    );
    
    const size = data.buffer.byteLength;
    console.log(size)
    const price = await bundlr.getPrice(size);
    console.log(price)
    console.log(await bundlr.fund(price))

    tags.push( {name: "Contract-App", value: "Othent.io"}, {name: 'File-Hash-JWT', value: dataHashJWT} )

    const transaction = await bundlr.upload(data.buffer, {
        tags,
    });

    const transaction_id = transaction.id;

    return {success: true, transactionId: transaction_id }

}

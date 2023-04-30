import Bundlr from "@bundlr-network/client";
import jwt from 'jsonwebtoken';
import queryDB from '../database/queryDB.js'


export default async function uploadFileToBundlr(data, dataHashJWT) {
    
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
    
    // const size = size of file
    // const price = await bundlr.getPrice(size);
    // await bundlr.fund(price);


    const transaction = await bundlr.uploadFile(data);
    console.log(`${pathToFile} --> Uploaded to https://arweave.net/${id}`);


    // transaction.addTag('App', 'Othent.io');
    // // transaction.addTag('File-Hash-JWT', dataHashJWT);

    // function addTagsToTransaction(transaction, tags) {
    //     for (let i = 0; i < tags.length; i++) {
    //     const tag = tags[i];
    //     transaction.addTag(tag.name, tag.value);
    //     }
    // }

    // const tags = jwt.decode(dataHashJWT).tags
    // addTagsToTransaction(transaction, tags)



    const transaction_id = transaction.id;


    return {success: true, transactionId: transaction_id }

}

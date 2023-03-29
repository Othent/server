import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../EXM/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function sendTransaction(JWT) {
    const unique_ID = jwt.decode(JWT).sub
    const contract_id = await queryDB(unique_ID);

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    const options = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Function", value: "broadcastTxn"}
    ]};

    const transaction_id = await contract.writeInteraction({
        function: 'broadcastTxn',
        jwt: JWT,
        encryption_type: 'JWT'
    }, options)


    return transaction_id
}



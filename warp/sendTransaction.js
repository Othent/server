import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../EXM/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function sendTransaction(JWT) {
    const unique_ID = jwt.decode(JWT).sub
    const contract_id = await queryDB(unique_ID);

    console.log(1)
    const wallet = await configureWallet()
    console.log(2)
    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    console.log(3)
    const options = {tags: {App: "Othent.io", Function: "broadcastTxn"}};
    console.log(4)
    const transaction_id = await contract.writeInteraction({
        jwt: JWT
    }, options)
    console.log(5)


    return transaction_id
}



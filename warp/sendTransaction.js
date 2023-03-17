import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../EXM/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function sendTransaction(JWT) {
    const unique_ID = jwt.decode(JWT).sub
    const contract_id = await queryDB(unique_ID);

    let JWK = await configureWallet()

    const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true }).connect(JWK)

    const transaction_id = await contract.writeInteraction({
        function: 'broadcastTxn', // take out of parsed JWT
        jwt: JWT
    })

    return transaction_id
}



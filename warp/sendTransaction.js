import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../EXM/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function sendTransaction(JWT) {
    const unique_ID = jwt.decode(JWT).sub
    // const contract_id = await queryDB(unique_ID);
    const contract_id = 'z9seutGmd35OJprewcrofLqnPUDSALIWO2KI7P9LfpQ'

    console.log(1)
    const wallet = await configureWallet()
    console.log(2)
    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    console.log(3)
    const options = {tags: [{ name: "App", value: "Othent.io" }, { name: "Function", value: "initializeContract" }]}
    console.log(4)
    const transaction_id = await contract.writeInteraction({
        jwt: JWT
    }, options)
    console.log(5)


    return transaction_id
}



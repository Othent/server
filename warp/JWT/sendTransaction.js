import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'
import jwt from 'jsonwebtoken';

export default async function sendTransaction(JWT) {

    // try and catch 


    const contract_id = await queryDB(JWT);
    const wallet = await configureWallet()
    const contract = warp.contract(contract_id.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    
    const decoded_JWT = jwt.decode(JWT)
    let tags = decoded_JWT.tags
    tags.push( {name: "Contract-App", value: "Othent.io"}, {name: "Function", value: "sendTransaction"} )
    const options = {tags};


    const transaction_id = await contract.writeInteraction({
        function: 'sendTransaction',
        jwt: JWT,
        encryption_type: 'JWT'
    }, options)


    return transaction_id
}



import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function sendTransaction(JWT) {


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


    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue

    const transactionId = transaction_id.originalTxId

    if (Object.keys(errorMessages).length === 0) {
        return { success: true, transactionId, errors: errorMessages }
    } else {
        return { success: false, transactionId, errors: errorMessages  }
    }


}

import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'


export default async function sendTransaction(JWT, tags) {

    const checkDB = await queryDB(JWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }

    const wallet = await configureWallet()
    const contract = warp.contract(checkDB.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    
    tags.push( {name: "Contract-App", value: "Othent.io"}, {name: "Function", value: "sendTransaction"} )
    const options = {tags};

    const transaction = await contract.writeInteraction({
        function: 'sendTransaction',
        jwt: JWT,
        encryption_type: 'JWT'
    }, options)


    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue
    const transactionId = transaction.originalTxId

    if (errorMessages[transactionId]) {
        return { success: false, transactionId, bundlrId: transaction.bundlrResponse.id, 
            errors: errorMessages[transactionId], state }
    } else if (errorMessages[transactionId] === undefined) {
        return { success: true, transactionId, bundlrId: transaction.bundlrResponse.id, 
            errors: {}, state }
    }


}



import { warp as warpFunction, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'
import addEntry from '../../patnerDashboard/addEntry.js'
import { LoggerFactory } from 'warp-contracts';
LoggerFactory.INST.logLevel('none');


export default async function sendTransaction(network, JWT, tags, clientID) {

    const checkDB = await queryDB(JWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }
    const decodedJWT = checkDB

    const wallet = await configureWallet()
    const warp = await warpFunction(network)
    const contract = warp.contract(decodedJWT.contract_id).setEvaluationOptions({ internalWrites: true }).connect(wallet.jwk)
    
    tags.push( {name: "Contract-App", value: "Othent.io"}, {name: "Function", value: "sendTransaction"} )
    const options = { tags };

    const transaction = await contract.writeInteraction({
        function: 'sendTransaction',
        jwt: JWT,
        encryption_type: 'JWT'
    }, options)


    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue
    const transactionId = transaction.originalTxId

    if (errorMessages[transactionId]) {

        const entry = addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionWarp', 'warp-transaction', false)
        return { success: false, transactionId, bundlrId: transaction.bundlrResponse.id, 
            errors: errorMessages[transactionId], entry }

    } else if (errorMessages[transactionId] === undefined) {

        addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'sendTransactionWarp', 'warp-transaction', true)
        return { success: true, transactionId, bundlrId: transaction.bundlrResponse.id, 
            errors: {} }

    }


}



import { warp as warpFunction, configureWallet } from '../warp-configs.js'
import readContract from '../readContract.js';
import queryDB from '../../database/queryDB.js';
import addEntry from '../../patnerDashboard/addEntry.js';

export default async function initializeJWK(network, PEM_key_JWT, clientID) {

    const checkDB = await queryDB(PEM_key_JWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }
    const decodedJWT = checkDB

    const check_no_key = await readContract(PEM_key_JWT)
    if (check_no_key.state.JWK_public_key === null) {

        const contract_id = decodedJWT.contract_id
        const wallet = await configureWallet()
        const warp = await warpFunction(network)
        const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)
        const options = {tags: [
            {name: "Contract-App", value: "Othent.io"}, 
            {name: "Function", value: "initializeJWK"}
        ]};

        const transaction = await contract.writeInteraction({
            function: 'initializeJWK',
            jwt: PEM_key_JWT,
            encryption_type: 'JWT'
        }, options)

        const { cachedValue } = await contract.readState();
        const { state, validity, errorMessages} = cachedValue
        const transactionId = transaction.originalTxId


        if (errorMessages[transactionId]) {

            addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'initializeJWK', 'backup-account', false)
            return { success: false, transactionId, bundlrId: transaction.bundlrResponse.id, 
                errors: errorMessages[transactionId] }
    
        } else if (errorMessages[transactionId] === undefined) {
    
            addEntry(clientID, decodedJWT.contract_id, decodedJWT.sub, transactionId, 'initializeJWK', 'backup-account', true)
            return { success: true, transactionId, bundlrId: transaction.bundlrResponse.id, 
                errors: {}, initJWK: decodedJWT.contract_input.data.JWK_public_key }
    
        }


    } else {
        return {success: false, message: 'Contract already has initialized a JWK public key,  to address: ' + decodedJWT.contract_input.data.JWK_public_key}
    }

    
}


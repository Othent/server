import { warp as warpFunction, configureWallet } from './warp-configs.js'
import queryDB from '../database/queryDB.js'


export default async function readContract(network, JWT, customDREURL) {

    const checkDB = await queryDB(JWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }

    const wallet = await configureWallet()
    const warp = await warpFunction(network, customDREURL)
    const contract = warp.contract(checkDB.contract_id)
    .setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)

    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
}


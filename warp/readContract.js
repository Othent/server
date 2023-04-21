import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../database/queryDB.js'


export default async function readContract(JWT) {

    const checkDB = await queryDB(JWT)
    if (checkDB.response === 'user not found') {
        return {success: false, message: 'Please create a Othent account'}
    }

    const wallet = await configureWallet()
    const contract = warp.contract(checkDB.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
}


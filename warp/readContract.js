import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../database/queryDB.js'


export default async function readContract(JWT) {

    const contract_id = await queryDB(JWT);

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

    const { cachedValue } = await contract.readState();
    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
}


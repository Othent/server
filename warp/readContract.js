import { warp, configureWallet } from './warp-configs.js'
import queryDB from '../database/queryDB.js'


export default async function readContract(JWT) {

    const contract_id = await queryDB(JWT);

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

    let { cachedValue } = await contract.readState();

    const state = cachedValue.state
    const errors = cachedValue.errorMessages
    

    return {state, errors}
}


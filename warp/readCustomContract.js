import { warp, configureWallet } from './warp-configs.js'


export default async function readCustomContract(contract_id) {

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

    let { cachedValue } = await contract.readState();

    const state = cachedValue.state
    const errors = cachedValue.errorMessages
    

    return {state, errors}
    
}


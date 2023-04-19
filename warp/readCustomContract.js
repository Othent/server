import { warp, configureWallet } from './warp-configs.js'


export default async function readCustomContract(contract_id) {

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

    const { cachedValue } = await contract.readState();

    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
    
}


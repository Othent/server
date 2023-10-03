import { warp as warpFunction, configureWallet } from './warp-configs.js'


export default async function readCustomContract(network, contract_id, customDREURL) {

    const wallet = await configureWallet()
    const warp = await warpFunction(network)

    let contract
    if (customDREURL) {
        contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncSource: customDREURL }).connect(wallet.jwk)
    } else {
        contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)
    }

    const { cachedValue } = await contract.readState();

    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
    
}


import { warp as warpFunction, configureWallet } from './warp-configs.js'


export default async function readCustomContract(network, contract_id) {

    const wallet = await configureWallet()
    const warp = await warpFunction(network)
    const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)

    const { cachedValue } = await contract.readState();

    const { state, validity, errorMessages} = cachedValue
    

    return { state, errors: errorMessages, validity }
    
}


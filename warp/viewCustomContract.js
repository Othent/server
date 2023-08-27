import { warp as warpFunction, configureWallet } from './warp-configs.js'


export default async function viewCustomContract(func, data, contract_id, network) {

    const wallet = await configureWallet()
    const warp = await warpFunction(network)
    const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)

    const { result } = await contract.viewState({
        function: func,
        data: data
    });

    return { success: true, result }
    
}

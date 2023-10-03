import { warp as warpFunction, configureWallet } from './warp-configs.js'


export default async function viewCustomContract(func, tags, contract_id, network, customDREURL) {

    const wallet = await configureWallet()
    const warp = await warpFunction(network, customDREURL)
    const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true, remoteStateSyncEnabled: true }).connect(wallet.jwk)

    const { result } = await contract.viewState({
        function: func,
        tags: tags
    });

    return { success: true, result }
    
}

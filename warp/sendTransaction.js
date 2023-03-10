import { warp, configureWallet } from './warp-configs.js'


export default async function sendTransaction(JWT, contract_id) {

    let JWK = await configureWallet()

    const contract = warp.contract(contract_id).setEvaluationOptions({ internalWrites: true }).connect(JWK)

    const transaction_id = await contract.writeInteraction({ function: 'broadcastTxn', jwt: JWT })


    return {transaction_id: transaction_id}
}

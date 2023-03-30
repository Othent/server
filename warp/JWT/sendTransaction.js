import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../EXM/queryDB.js'

export default async function sendTransaction(JWT) {

    const contract_id = await queryDB(JWT);

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id.wallet_contract).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    const options = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Function", value: "sendTransaction"}
    ]};

    const transaction_id = await contract.writeInteraction({
        function: 'sendTransaction',
        jwt: JWT,
        encryption_type: 'JWT'
    }, options)


    return transaction_id.originalTxId
}



import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../EXM/queryDB.js'

// this does not work / hasnt been checked

export default async function JWKBackupTxn(JWT) {


    // query diff DB (same) for the JWK public keys to contract IDs
    const contract_id = await queryDB(JWT); // make sure client id is in this

    const wallet = await configureWallet()
    const contract = warp.contract(contract_id.wallet_contract).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    const options = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Function", value: "JWKBackupTxn"}
    ]};

    const transaction_id = await contract.writeInteraction({
        function: 'JWKBackupTxn',
        jwt: JWT,
        encryption_type: 'JWK'
    }, options)

    return transaction_id.originalTxId
}



import { warp, configureWallet } from '../warp-configs.js'
import queryDB from '../../database/queryDB.js'



export default async function JWKBackupTxn(JWK_signed_JWT) {

    const user = await queryDB(JWK_signed_JWT);


    const wallet = await configureWallet()
    const contract = warp.contract(user.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
    const options = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Function", value: "JWKBackupTxn"}
    ]};

    const transaction_id = await contract.writeInteraction({
        function: 'JWKBackupTxn',
        jwt: JWK_signed_JWT,
        encryption_type: 'JWK'
    }, options)

    return transaction_id.originalTxId
}



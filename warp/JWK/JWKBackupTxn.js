import { warp, configureWallet } from '../warp-configs.js'
import readContract from '../readContract.js';
import jwt from 'jsonwebtoken';


export default async function JWKBackupTxn(JWK_signed_JWT) {
    try {
        const state = (await readContract(JWK_signed_JWT)).state
        const current_nonce = jwt.decode(JWK_signed_JWT).iat

        if (state.last_nonce < current_nonce) {
            const wallet = await configureWallet()
            const contract = warp.contract(state.contract_address).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

            

            let tags = jwt.decode(JWK_signed_JWT).tags
            tags ??= [];
            tags.push( {name: "Contract-App", value: "Othent.io"}, {name: "Function", value: "JWKBackupTxn"} )
            const options = {tags};

            const transaction_id = await contract.writeInteraction({
                function: 'JWKBackupTxn',
                jwt: JWK_signed_JWT,
                encryption_type: 'JWK'
            }, options)

            console.log(options)

            return { success: true, transaction_id: transaction_id.originalTxId }
        } else {
            return { success: false, message: 'Invalid nonce' }
        }
    } catch (error) {
        throw new Error(`JWK transaction error: ${error.message}`)
    }
}


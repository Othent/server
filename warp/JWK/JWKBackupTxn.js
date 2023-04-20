import { warp, configureWallet } from '../warp-configs.js'
import readContract from '../readContract.js';
import jwt from 'jsonwebtoken';


export default async function JWKBackupTxn(JWK_signed_JWT) {
    try {

        const current_state = (await readContract(JWK_signed_JWT)).state

        const decoded_JWT = jwt.decode(JWK_signed_JWT)

        const current_nonce = decoded_JWT.iat


        if (current_state.JWK_public_key !== null) {

            if (current_state.last_nonce < current_nonce) {

                const wallet = await configureWallet()
                const contract = warp.contract(current_state.contract_address).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)

                let tags = decoded_JWT.tags
                tags ??= [];
                tags.push( {name: "Contract-App", value: "Othent.io"}, {name: "Function", value: "JWKBackupTxn"} )
                const options = {tags};

                const othentFunction = decoded_JWT.contract_input.othentFunction

                const transaction = await contract.writeInteraction({
                    function: othentFunction,
                    jwt: JWK_signed_JWT,
                    encryption_type: 'JWK'
                }, options)

                const { cachedValue } = await contract.readState();
                const { state, validity, errorMessages} = cachedValue
                const transactionId = transaction.originalTxId

                if (errorMessages[transactionId]) {
                    return { success: false, transactionId, bundlrId: transaction.bundlrResponse.id, 
                        errors: errorMessages[transactionId], state }
                } else if (errorMessages[transactionId] === undefined) {
                    return { success: true, transactionId, bundlrId: transaction.bundlrResponse.id, 
                        errors: {}, state }
                }

            } else {
                return { success: false, message: 'Invalid nonce' }
            }
            

        } else {
            return { success: false, message: 'No JWK initialized' }
        }

    } catch (error) {
        console.error(`JWK transaction error: ${error.message}`);
        return { success: false, message: 'Error processing JWK transaction', error: error.message };
    }
}



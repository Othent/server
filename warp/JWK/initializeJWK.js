import { warp, configureWallet } from '../warp-configs.js'
import readContract from '../readContract.js';

export default async function initializeJWK(PEM_key_JWT) {

    const check_no_key = await readContract(PEM_key_JWT)

    if (check_no_key.state.JWK_public_key === null) {

        const contract_id = check_no_key.state.contract_address

        const wallet = await configureWallet()
        const contract = warp.contract(contract_id.contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet.jwk)
        const options = {tags: [
            {name: "Contract-App", value: "Othent.io"}, 
            {name: "Function", value: "initializeJWK"}
        ]};

        const transaction_id = await contract.writeInteraction({
            function: 'initializeJWK',
            jwt: PEM_key_JWT,
            encryption_type: 'JWT'
        }, options)

        return {success: true, transaction_id: transaction_id.originalTxId}

    } else {
        return {success: false, message: 'Contract already has initialized a JWK public key'}
    }

    
}


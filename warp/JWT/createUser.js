import { warp, configureWallet } from '../warp-configs.js'
import updateDB from '../../EXM/updateDB.js'
import queryDB from '../../EXM/queryDB.js'
import jwt from 'jsonwebtoken';


export default async function createUser(JWT) { 

    const checkDB = await queryDB(JWT)

    if (checkDB.response === 'user not found') {

        const wallet = await configureWallet()
        const contract_state = { 
            App: "Othent.io", 
            Description: "Merging Web2 to Web3 user logins with a familiar and simple interface",
            user_id: null, 
            contract_address: null,
            last_nonce: null,
            JWK_public_key: null
        }
        let contract_code = await fetch('https://othent.io/contract.txt')
        contract_code = await contract_code.text();


        const createOptions = {tags: [
            {name: "Contract-App", value: "Othent.io"}, 
            {name: "Contract-Description", value: "Othent.io merges Web2 to Web3 user logins with a familiar and simple interface"}, 
        ]};
        let tags = createOptions.tags
        const { contractTxId } = await warp.deploy({
            wallet: wallet, 
            initState: JSON.stringify(contract_state), 
            src: contract_code,
            tags
        });

        const contract = warp.contract(contractTxId).connect(wallet.jwk).setEvaluationOptions({internalWrites: true})

        const writeOptions = {tags: [
            {name: "Contract-App", value: "Othent.io"}, 
            {name: "Function", value: "initializeContract"}
        ]};

        await contract.writeInteraction({
            function: 'initializeContract',
            jwt: JWT,
            contract_address: contractTxId,
            encryption_type: "JWT"
        }, writeOptions)
    


        const unique_ID = jwt.decode(JWT).sub
        await updateDB(unique_ID, contractTxId)

        return contractTxId

    }

    else {
        return checkDB.wallet_contract
    }
    
}




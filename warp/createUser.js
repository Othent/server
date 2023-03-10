import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    const contract_state = JSON.stringify({ "Project": "ProjectName.com", user_id: null, contract_address: null })
    const contract_code = await fetch('https://rdzgnxupp52jg7y7pephsxmhjjapt7elgfmruhipxh3kxa5k4nqa.arweave.net/iPJm3o9_dJN_H3keeV2HSkD5_IsxWRodD7n2q4Oq42A')
    console.log(contract_code)

    let wallet_contract = await warp.createContract.deploy({
        wallet, 
        initState: contract_state, 
        src: contract_code, 
    })
    wallet_contract = wallet_contract.contractTxId

    const contract = warp.contract(wallet_contract).setEvaluationOptions({internalWrites: true}).connect(wallet)

    const unique_ID = jwt.decode(JWT).sub

    const options = {tags: {App: 'Auth-Project', User: unique_ID, Wallet_Contract: wallet_contract}};

    await contract.writeInteraction({
        function: 'initializeContract', 
        jwt: JWT,
        contract_address: wallet_contract
    }, options)

 
    await updateDB(unique_ID, wallet_contract)

    return wallet_contract
    
}
import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    console.log(wallet)
    const contract_state = {App: 'Othent.io', user_id: null, contract_address: null}
    let contract_code = await fetch('https://othent.io/contract.txt')
    contract_code = await contract_code.text();

    let wallet_contract = await warp.createContract.deploy({
        wallet, 
        initState: contract_state, 
        src: contract_code, 
    })
    wallet_contract = wallet_contract.contractTxId

    const contract = warp.contract(wallet_contract).setEvaluationOptions({internalWrites: true}).connect(wallet)

    await contract.writeInteraction({
        function: 'initializeContract', 
        jwt: JWT,
        contract_address: wallet_contract
    })

 
    const unique_ID = jwt.decode(JWT).sub
    await updateDB(unique_ID, wallet_contract)

    return wallet_contract
    
}
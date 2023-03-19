import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    const contract_state = {App: "Othent.io", user_id: null, contract_address: null}
    let contract_code = await fetch('https://othent.io/contract.txt')
    contract_code = await contract_code.text();

    console.log('1')

    let wallet_contract = await warp.createContract.deploy({
        wallet, 
        initState: JSON.stringify(contract_state), 
        src: contract_code, 
    })
    wallet_contract = wallet_contract.contractTxId

    console.log('2')
    console.log('2000000', wallet_contract)

    const contract = warp.contract(wallet_contract).setEvaluationOptions({internalWrites: true}).connect(wallet)

    console.log('3')

    await contract.writeInteraction({
        function: 'initializeContract', 
        jwt: JWT,
        contract_address: wallet_contract
    })

    console.log('4')

 
    const unique_ID = jwt.decode(JWT).sub
    await updateDB(unique_ID, wallet_contract)

    return wallet_contract
    
}
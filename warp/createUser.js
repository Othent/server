import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    const contract_state = {App: "Othent.io", user_id: null, contract_address: null}
    let contract_code = await fetch('https://othent.io/contract.txt')
    contract_code = await contract_code.text();


    const { contractTxId } = await warp.deploy({
        wallet: wallet, // usually your Arweave wallet
        initState: JSON.stringify(contract_state), // remember to stringify the initial state object
        src: contract_code,
      });

    const contract = warp.contract(contractTxId).setEvaluationOptions({internalWrites: true}).connect(wallet)

    console.log('3')

    const men = await contract.writeInteraction({
        jwt: JWT,
        contract_address: contractTxId
    })

    console.log('4')

 
    // const unique_ID = jwt.decode(JWT).sub
    // await updateDB(unique_ID, contractTxId)

    return men
    
}
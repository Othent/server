import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) { // always refer to sunday before hand

    const wallet = await configureWallet()
    const contract_state = {App: "Othent.io", user_id: null, contract_address: null}
    let contract_code = await fetch('https://othent.io/contract.txt')
    contract_code = await contract_code.text();


    const { contractTxId } = await warp.deploy({
        wallet: wallet, 
        initState: JSON.stringify(contract_state), 
        src: contract_code,
      });

    const contract = warp.contract(contractTxId).connect(wallet.jwk).setEvaluationOptions({internalWrites: true})

    const options = {tags: [{ name: "App", value: "Othent.io" }, { name: "Function", value: "initializeContract" }]}

    await contract.writeInteraction({
        jwt: JWT,
        contract_address: contractTxId
    }, options)

 
    const unique_ID = jwt.decode(JWT).sub
    await updateDB(unique_ID, contractTxId)


    return contractTxId
    
}
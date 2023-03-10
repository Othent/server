import * as fs from 'fs';
import { warp, configureWallet } from './warp-configs.js'
import updateDB from '../EXM/updateDB.js'
import jwt from 'jsonwebtoken'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    const contract_state = fs.readFile('./state.json', 'utf-8')
    const contractCode = fs.readFile('./contract.js', 'utf-8')

    let wallet_contract = await warp.createContract.deploy({
        wallet, 
        initState: contract_state, 
        src: contractCode, 
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
import * as fs from 'fs';
import { warp, configureWallet } from './warp-configs.js'


export default async function createUser(JWT) {

    const wallet = await configureWallet()
    const contract_state = fs.readFileSync('state.json', 'utf-8')
    const contractCode = fs.readFileSync('contract.js', 'utf-8')

    let contract_id = await warp.createContract.deploy({
        wallet, 
        initState: contract_state, 
        src: contractCode, 
    })
    contract_id = contract_id.contractTxId

    const contract = warp.contract(contract_id).setEvaluationOptions({internalWrites: true}).connect(wallet)

    const options = {tags: {uid: 'World', value: 'world'}};

    await contract.writeInteraction({
        function: 'initializeContract', 
        jwt: JWT,
        contract_address: contract_id
    }, options)

    return {contract_id: contract_id}
    
}
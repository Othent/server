import { EXM_functionID } from './EXM_functionID.js'


export default async function updateDB(unique_ID, wallet_contract) {
    const input = {'unique_ID': unique_ID, 'wallet_contract': wallet_contract}

    fetch(`https://${EXM_functionID}.exm.run`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( input )
    })
    
}
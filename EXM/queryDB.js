import { EXM_functionID } from './EXM_functionID.js'


export default async function queryDB(unique_id) {
    const response = await fetch(`https://${EXM_functionID}.exm.run/`);
    const response_json = await response.json();

    const full_user_ids_list = response_json.user_ids
    const full_wallet_contracts_dict = response_json.wallet_contracts

    console.log(unique_id)

    if (full_user_ids_list.includes(unique_id)) {
      const wallet_contract = full_wallet_contracts_dict[unique_id]
      return {wallet_contract: wallet_contract, unique_ID: unique_id}

    } else {
      return {'response': 'user not found'}
    }

  }


 

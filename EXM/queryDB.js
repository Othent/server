import { EXM_functionID } from './EXM_functionID.js'


export default async function queryDB(unique_ID) {
    const response = await fetch(`https://${EXM_functionID}.exm.run/`);
    const response_json = await response.json();

    const full_user_ids_list = response_json.user_ids
    const full_wallet_contracts_dict = response_json.wallet_contracts

    if (full_user_ids_list.includes(unique_ID)) {
      const wallet_contract = full_wallet_contracts_dict[unique_ID]
      return {wallet_contract: wallet_contract, unique_ID: unique_ID}

    } else {
      return {'response': 'user not found'}
    }

  }

 

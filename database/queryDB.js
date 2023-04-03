import jwt from 'jsonwebtoken';


export default async function queryDB(JWT) {
  
  const contract_address = jwt.decode(JWT).contract_address
  const unique_id = jwt.decode(JWT).sub

  console.log(contract_address)

  if (contract_address) {
    return {wallet_contract: contract_address, unique_ID: unique_id}

  } else {
    return {'response': 'user not found'}
  }

}


 

import jwt from 'jsonwebtoken';


export default async function queryDB(JWT) {
  
  const contract_id = jwt.decode(JWT).contract_id

  if (contract_id) {
    const unique_id = jwt.decode(JWT).sub
    return {contract_id: contract_id, unique_ID: unique_id}

  } else {
    return {response: 'user not found'}
  }

}


 

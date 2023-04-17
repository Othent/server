import jwt from 'jsonwebtoken';


export default async function queryDB(JWT) {

  console.log(JWT)
  console.log(jwt.decode(JWT))
  
  const contract_id = jwt.decode(JWT).contract_id
  const unique_id = jwt.decode(JWT).sub

  if (contract_id) {
    return {contract_id: contract_id, unique_ID: unique_id}

  } else {
    return {'response': 'user not found'}
  }

}


 

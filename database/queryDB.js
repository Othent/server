import jwt from 'jsonwebtoken';


export default async function queryDB(JWT) {
  const decodedJWT = jwt.decode(JWT);
  const contract_id = decodedJWT.contract_id;

  if (contract_id) {
    decodedJWT.unique_ID = decodedJWT.sub;
    return decodedJWT;
  } else {
    return { response: 'user not found' };
  }
}


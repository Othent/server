

export default async function checkAPIID(clientID) {

  const existing_API_IDs = JSON.parse(process.env.API_IDS)
    
  if (existing_API_IDs.includes(clientID)) {
    return { response: 'ok', success: true }
  } else {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false }
  }

}

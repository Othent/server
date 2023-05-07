

export default async function checkAPIKey(API_KEY, API_ID) {
    
  if ( { ID: API_ID, KEY: API_KEY } in process.env.API_KEYS) {
    return { response: 'ok', success: true }
  } else {
    return { response: 'Invalid API keys / not found - get API keys at Othent.io', success: false }
  }

}
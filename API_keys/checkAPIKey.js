

export default async function checkAPIKey(API_KEY, API_ID) {

  const existing_API_keys = JSON.parse(process.env.API_KEYS)
    
  if ( { ID: API_ID, KEY: API_KEY } in existing_API_keys) {
    console.log(true)
    return { response: 'ok', success: true }
  } else {
    console.log(false)
    return { response: 'Invalid API keys / not found - get API keys at Othent.io', success: false }
  }

}
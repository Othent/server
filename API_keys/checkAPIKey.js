

export default async function checkAPIKey(API_KEY, API_ID) {

  console.log('Lorimer')

  const existing_API_keys = process.env.API_KEYS

  console.log('existing_API_keys', existing_API_keys);
    
  if (API_KEY in existing_API_keys) {
    console.log(true)
    return { response: 'ok', success: true }
  } else {
    console.log(false)
    return { response: 'Invalid API keys / not found - get API keys at Othent.io', success: false }
  }

}

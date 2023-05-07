

export default async function checkAPIKey(API_KEY, API_ID) {

  const existing_API_keys = process.env.API_KEYS
    
  if (existing_API_keys.includes(API_KEY)) {
    return { response: 'ok', success: true }
  } else {
    return { response: 'Invalid API keys / not found - get API keys at Othent.io', success: false }
  }

}




export default async function checkAPIKey(API_KEY, API_ID) {

  console.log('Lorimer')

  let h = [{ ID: API_ID, KEY: API_KEY }]
  console.log('h', h)
  
  const value = JSON.stringify(parsedKeys);

  const existing_API_keys = JSON.parse([]);

  console.log('existing_API_keys', existing_API_keys);
    
  if (existing_API_keys.some(obj => obj.ID === API_ID && obj.KEY === API_KEY)) {
    console.log(true)
    return { response: 'ok', success: true }
  } else {
    console.log(false)
    return { response: 'Invalid API keys / not found - get API keys at Othent.io', success: false }
  }

}

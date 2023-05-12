

export default async function checkAPIID(API_ID) {

  const existing_API_IDs = JSON.parse(process.env.API_IDS)
    
  if (existing_API_IDs.includes(API_ID)) {
    return { response: 'ok', success: true }
  } else {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false }
  }



}


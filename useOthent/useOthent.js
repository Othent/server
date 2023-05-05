
export default async function useOthent(API_KEY, API_ID) {
  

  console.log(API_KEY, API_ID)
    
  if (API_KEY) {
    return true
  } else {
    return {response: 'user not found'}
  }

  
  
}
  
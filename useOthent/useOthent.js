import updateAuth0ApplicationUrls from '../auth0Management/callbackURLs.js';

export default async function useOthent(clientID, callbackURLs) {
  const existingAPIIDs = JSON.parse(process.env.API_IDS);
  if (!existingAPIIDs.includes(clientID)) {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false };
  }

  const existingCallbackURLs = JSON.parse(process.env.CallbackURLs);

  const invalidCallbackURLs = callbackURLs.filter((url) => !existingCallbackURLs.includes(url));

  if (invalidCallbackURLs.length > 0) {
    for (const url of invalidCallbackURLs) {
      await updateAuth0ApplicationUrls(url);
    }
    return { response: 'ok', success: true };
  } else {
    return { response: 'ok', success: true };
  }
}

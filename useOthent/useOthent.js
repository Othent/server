import updateAuth0ApplicationUrls from '../auth0Management/callbackURLs.js';

export default async function useOthent(clientID, callbackURL) {
  const existingAPIIDs = JSON.parse(process.env.API_IDS);
  if (!existingAPIIDs.includes(clientID)) {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false };
  }

  const existingCallbackURLs = JSON.parse(process.env.callbackURLs);

  if (!existingCallbackURLs.includes(callbackURL)) {
    await updateAuth0ApplicationUrls(callbackURL);
    return { response: 'ok', success: true };
  } else {
    return { response: 'ok', success: true };
  }
}

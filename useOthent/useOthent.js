import updateAuth0ApplicationUrls from '../auth0Management/callbackURLs.js';
import alert from '../database/alert.js';
import { URL } from 'url';



export default async function useOthent(clientID, incomingURL) {
  const existingAPIIDs = JSON.parse(process.env.API_IDS);
  if (!existingAPIIDs.includes(clientID)) {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false };
  }

  console.log(incomingURL)
  const callbackURL = new URL(incomingURL)
  console.log(callbackURL)
  let wildcardDomain;
  if (
    callbackURL.protocol === 'chrome-extension:' ||
    callbackURL.protocol === 'safari-web-extension:' ||
    callbackURL.protocol === 'moz-extension:' ||
    callbackURL.protocol === 'extension:'
  ) {
    wildcardDomain = callbackURL.href;
  } else if (callbackURL.hostname === 'localhost') {
    wildcardDomain = callbackURL.href;
  } else {
    const hostnameParts = callbackURL.hostname.split('.');
    const domain = `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`;
    wildcardDomain = `https://*.${domain}`;
  }

  await alert('new callbackURL', { callbackURL: callbackURL.href, wildcardDomain: wildcardDomain })

  const existingWildcardDomains = JSON.parse(process.env.existingWildcardDomains);

  if (!existingWildcardDomains.includes(wildcardDomain)) {
    await updateAuth0ApplicationUrls(wildcardDomain);
    await alert('new callbackURL', { callbackURL: callbackURL.href, wildcardDomain: wildcardDomain })
    return { response: 'ok', success: true };
  } else {
    return { response: 'ok', success: true };
  }
}

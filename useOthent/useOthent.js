import updateAuth0ApplicationUrls from '../auth0Management/callbackURLs.js';
import alert from '../database/alert.js';
import { URL } from 'url';

const COUNTRY_TLDS = JSON.parse(process.env.COUNTRY_TLDS)
const GENERIC_TLDS = JSON.parse(process.env.GENERIC_TLDS)

export default async function useOthent(clientID, incomingURL) {

  const callbackURL = new URL(incomingURL)
  let wildcardDomain;
  if (
    callbackURL.protocol === 'chrome-extension:' ||
    callbackURL.protocol === 'safari-web-extension:' ||
    callbackURL.protocol === 'moz-extension:' ||
    callbackURL.protocol === 'extension:'
  ) {
    wildcardDomain = `${callbackURL.protocol}//${callbackURL.hostname}`;
  } else if (callbackURL.hostname === 'localhost') {
    wildcardDomain = callbackURL.origin
  } else {
    const hostnameParts = callbackURL.hostname.split('.');
    let domain = `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`;

    if (
      hostnameParts.length > 2 &&
      COUNTRY_TLDS.includes(hostnameParts[hostnameParts.length - 1]) &&
      GENERIC_TLDS.includes(hostnameParts[hostnameParts.length - 2])
    )
      domain = `${hostnameParts[hostnameParts.length - 3]}.${domain}`;
      wildcardDomain = `${callbackURL.protocol}//*.${domain}/`;
  }

  const existingWildcardDomains = JSON.parse(process.env.existingWildcardDomains);

  if (!existingWildcardDomains.includes(wildcardDomain)) {
    await updateAuth0ApplicationUrls(wildcardDomain);
    await alert('new callbackURL', { callbackURL: callbackURL.href, wildcardDomain, clientID})
    return { response: 'ok', success: true };
  } else {
    return { response: 'ok', success: true };
  }
}

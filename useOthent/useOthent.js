import updateAuth0ApplicationUrls from '../auth0Management/callbackURLs.js';
import alert from '../database/alert.js';
import { URL } from 'url';

const COUNTRY_TLDS = ['ac','ad','ae','af','ag','ai','al','am','ao','aq','ar','as','at','au','aw','ax','az','ba','bb','bd','be','bf','bg','bh','bi','bj','bm','bn','bo','bq','br','bs','bt','bw','by','bz','ca','cc','cd','cf','cg','ch','ci','ck','cl','cm','cn','co','cr','cu','cv','cw','cx','cy','cz','de','dj','dk','dm','do','dz','ec','ee','eg','eh','er','es','et','eu','fi','fj','fk','fm','fo','fr','ga','gd','ge','gf','gg','gh','gi','gl','gm','gn','gp','gq','gr','gs','gt','gu','gw','gy','hk','hm','hn','hr','ht','hu','id','ie','il','im','in','io','iq','ir','is','it','je','jm','jo','jp','ke','kg','kh','ki','km','kn','kp','kr','kw','ky','kz','la','lb','lc','li','lk','lr','ls','lt','lu','lv','ly','ma','mc','md','me','mg','mh','mk','ml','mm','mn','mo','mp','mq','mr','ms','mt','mu','mv','mw','mx','my','mz','na','nc','ne','nf','ng','ni','nl','no','np','nr','nu','nz','om','pa','pe','pf','pg','ph','pk','pl','pm','pn','pr','ps','pt','pw','py','qa','re','ro','rs','ru','rw','sa','sb','sc','sd','se','sg','sh','si','sk','sl','sm','sn','so','sr','ss','st','su','sv','sx','sy','sz','tc','td','tf','tg','th','tj','tk','tl','tm','tn','to','tr','tt','tv','tw','tz','ua','ug','uk','us','uy','uz','va','vc','ve','vg','vi','vn','vu','wf','ws','ye','yt','za','zm','zw',]

export default async function useOthent(clientID, incomingURL) {
  const existingAPIIDs = JSON.parse(process.env.API_IDS);
  if (!existingAPIIDs.includes(clientID)) {
    return { response: 'Invalid API ID / not found - get API ID at Othent.io', success: false };
  }

  const callbackURL = new URL(incomingURL)
  let wildcardDomain;
  if (
    callbackURL.protocol === 'chrome-extension:' ||
    callbackURL.protocol === 'safari-web-extension:' ||
    callbackURL.protocol === 'moz-extension:' ||
    callbackURL.protocol === 'extension:'
  ) {
    wildcardDomain = callbackURL.href;
  } else if (callbackURL.hostname === 'localhost') {
    wildcardDomain = callbackURL.origin;
  } else {
    const hostnameParts = callbackURL.hostname.split('.');
    let domain = `${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}`;

    if (hostnameParts.length > 2 && COUNTRY_TLDS.includes(hostnameParts[hostnameParts.length - 1]))
      domain = `${hostnameParts[hostnameParts.length - 3]}.${domain}`;

    wildcardDomain = `${callbackURL.protocol}://*.${domain}/`;
  }

  const existingWildcardDomains = JSON.parse(process.env.existingWildcardDomains);

  if (!existingWildcardDomains.includes(wildcardDomain)) {
    await updateAuth0ApplicationUrls(wildcardDomain);
    await alert('new callbackURL', { callbackURL: callbackURL.href, wildcardDomain, clientID })
    return { response: 'ok', success: true };
  } else {
    return { response: 'ok', success: true };
  }
}

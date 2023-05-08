import axios from "axios";

export default async function updateAuth0ApplicationUrls(newURLs) {
  const auth0Domain = process.env.auth0Domain;
  const auth0ClientId = process.env.auth0ClientId;
  const auth0ClientSecret = process.env.auth0ClientSecret;
  const audience = `https://${auth0Domain}/api/v2/`;
  const tokenUrl = `https://${auth0Domain}/oauth/token`;
  const tokenParams = {
    grant_type: "client_credentials",
    client_id: auth0ClientId,
    client_secret: auth0ClientSecret,
    audience: audience,
  };


  const tokenResponse = await axios.post(tokenUrl, tokenParams);
  const token = tokenResponse.data.access_token;


  const apiUrl = `${audience}clients/dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };


  const appResponse = await axios.get(apiUrl, { headers });
  const appConfig = appResponse.data;

  console.log(typeof appConfig.callbacks, appConfig.callback)
  console.log(typeof JSON.parse(appConfig.callbacks), appConfig.callbacks)

  const currentCallbacks = appConfig.callbacks
  const newCallbacks = currentCallbacks.push(newURLs)

  const currentNewLogoutUrls = appConfig.logout_urls
  const newLogoutUrls = currentNewLogoutUrls.push(newURLs)

  const currentAllowedOrigins = appConfig.web_origins
  const newAllowedOrigins = currentAllowedOrigins.push(newURLs)


  const body = {
    callbacks: newCallbacks,
    logout_urls: newLogoutUrls,
    web_origins: newAllowedOrigins,
  };


  try {
    const updateResponse = await axios.patch(apiUrl, body, { headers });
    console.log("updateResponse", updateResponse);
    return {
      success: true,
      message: `Successfully updated application URLs`,
    };
  } catch (error) {
    console.error("updateError", error);
    return {
      success: false,
      message: `Error updating application URLs: ${error}`,
    };
  }
}


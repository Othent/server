import axios from "axios";

export default async function updateAuth0ApplicationUrls(URL) {

  if (typeof URL !== "string" || !URL.trim()) {
    throw new Error("Invalid URL");
  }


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


  let token;
  try {
    const tokenResponse = await axios.post(tokenUrl, tokenParams);
    token = tokenResponse.data.access_token;
  } catch (error) {
    throw new Error(`Failed to retrieve access token: ${error.message}`);
  }


  const apiUrl = `${audience}clients/${process.env.auth0_app_id}`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  let appConfig;
  try {
    const appResponse = await axios.get(apiUrl, { headers });
    appConfig = appResponse.data;
  } catch (error) {
    throw new Error(`Failed to retrieve application configuration: ${error.message}`);
  }


  const currentCallbacks = Array.isArray(appConfig.callbacks) ? appConfig.callbacks : [];
  const currentNewLogoutUrls = Array.isArray(appConfig.allowed_logout_urls) ? appConfig.allowed_logout_urls : [];
  const currentAllowedOrigins = Array.isArray(appConfig.web_origins) ? appConfig.web_origins : [];


  const newURLs = [URL];
  const newCallbacks = [...new Set([...currentCallbacks, ...newURLs])];
  const newLogoutUrls = [...new Set([...currentNewLogoutUrls, ...newURLs])];
  const newAllowedOrigins = [...new Set([...currentAllowedOrigins, ...newURLs])];


  const body = {
    callbacks: newCallbacks,
    allowed_logout_urls: newLogoutUrls,
    web_origins: newAllowedOrigins,
  };
  try {
    await axios.patch(apiUrl, body, { headers });
    return {
      success: true,
      message: `Successfully updated application URLs`,
    };
  } catch (error) {
    throw new Error(`Failed to update application URLs: ${error.message}`);
  }
}

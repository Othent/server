import axios from "axios";

export default async function updateAuth0ApplicationUrls(callbackUrls, logoutUrls, allowedOrigins) {
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

  // Get a token for the Auth0 Management API
  const tokenResponse = await axios.post(tokenUrl, tokenParams);
  const token = tokenResponse.data.access_token;

  // Define the Auth0 API URL and headers
  const apiUrl = `${audience}clients/dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Get the current application configuration
  const appResponse = await axios.get(apiUrl, { headers });
  const appConfig = appResponse.data;

  // Update the callback URLs, logout URLs, and allowed web origins
  const newCallbacks = [...appConfig.callbacks, ...callbackUrls];
  const newLogoutUrls = appConfig.logout_urls
    ? [...appConfig.logout_urls, ...logoutUrls]
    : [...logoutUrls];
  const newAllowedOrigins = [...appConfig.web_origins, ...allowedOrigins];
  const body = {
    callbacks: newCallbacks,
    logout_urls: newLogoutUrls,
    web_origins: newAllowedOrigins,
  };

  // Call the Auth0 Management API to update the application configuration
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

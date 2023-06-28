import axios from "axios";

export default async function queryUser(API_ID) {

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

  try {
    const response = await axios.get(`https://${process.env.auth0Domain}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: `user_metadata.API_ID:"${API_ID}"`,
        fields: 'email',
      },
    });

    const users = response.data;
    if (users.length > 0) {
      const email = users[0].email;
      return email;
    } else {
      return 'Users email not found';
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

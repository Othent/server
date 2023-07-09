import axios from 'axios';


export default async function checkIfClaimed(userId) {
    const auth0Domain = process.env.auth0Domain;
    const auth0ClientId = process.env.auth0ClientId;
    const auth0ClientSecret = process.env.auth0ClientSecret;
    const audience = `https://${auth0Domain}/api/v2/`;
    const tokenUrl = `https://${auth0Domain}/oauth/token`;
    const tokenParams = {
        grant_type: 'client_credentials',
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

    const getUserUrl = `https://${auth0Domain}/api/v2/users/${userId}`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const userResponse = await axios.get(getUserUrl, { headers });
        const appMetadata = userResponse.data.app_metadata;
        const isClaimed = appMetadata && appMetadata.claimed;

        console.log(isClaimed)
        if (isClaimed) {
            return true
        } else {
            const updateMetadataUrl = `https://${auth0Domain}/api/v2/users/${userId}`;
            const updatedAppMetadata = { claimed: true };
            await axios.patch(updateMetadataUrl, { user_metadata: updatedAppMetadata }, { headers });
            return false;
        }

    } catch (error) {
        throw new Error(`Failed to retrieve user's app metadata: ${error.message}`);
    }
}

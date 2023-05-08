import axios from "axios";


export default async function addCallbackURL(callbackURL) {

    console.log(10, callbackURL)


    var auth0Domain = process.env.auth0Domain;
    var auth0ClientId = process.env.auth0ClientId;
    var auth0ClientSecret = process.env.auth0ClientSecret;
    var audience = 'https://' + auth0Domain + '/api/v2/';
    var tokenUrl = 'https://' + auth0Domain + '/oauth/token';
    var tokenParams = {
    grant_type: 'client_credentials',
    client_id: auth0ClientId,
    client_secret: auth0ClientSecret,
    audience: audience
    };

    axios.post(tokenUrl, tokenParams)
    .then(function (response) {
        var token = response.data.access_token;

        console.log(token)

        const apiUrl = `${audience}clients/dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C`;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const body = { callbacks: [ callbackURL ] };

        axios.patch(apiUrl, body, { headers })
        .then(response => {
            return {response: true, message: `Successfully updated allowed URLs: ${response.data.callbacks}`}
        })
        .catch(error => {
            return {response: false, message: `Error updating allowed URLs: ${error}`}
        });   

    })
    .catch(error => {
        return {response: false, message: `Error updating allowed URLs: ${error}`}
    });   
    
  }
import axios from 'axios'

export default async function updateDB(unique_ID, contract_id, JWT) {

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

        var options = {
            method: 'PATCH',
            url: 'https://othent.us.auth0.com/api/v2/users/' + unique_ID,
            headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
            data: {
                user_metadata: { 
                    contract_id: contract_id,
                    initialize_JWT: JWT
                }
            }
        };
        
        axios.request(options).then(function (response) {
            return response.data
        }).catch(function (error) {
            console.error(error);
        });

    })

}






  
  
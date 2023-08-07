import axios from 'axios'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import updateHerokuAPIID from '../API_IDs/updateHerokuKeys.js'
import createClient from '../patnerDashboard/createClient.js'
import addEntry from '../patnerDashboard/addEntry.js'


export default async function newUserUpdateDB(contract_id, JWT, appClientID, transactionId, network) {

    if (network === 'mainNet') {

        const decoded_JWT = jwt.decode(JWT)

        const clientID = crypto.randomBytes(16).toString('hex')

        await updateHerokuAPIID(clientID)
        await createClient(clientID)
        addEntry(appClientID, contract_id, clientID, transactionId, 'logIn', 'new-user', true)

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
                url: 'https://othent.us.auth0.com/api/v2/users/' + decoded_JWT.sub,
                headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
                data: {
                    user_metadata: { 
                        contract_id: contract_id,
                        initialize_JWT: JWT,
                        API_ID: clientID
                    }
                }
            };
            
            axios.request(options).then(function (response) {
                return response.data
            }).catch(function (error) {
                console.error(error);
            });

        })

    } else if (network === 'testNet') {


        const decoded_JWT = jwt.decode(JWT)

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
                url: 'https://othent.us.auth0.com/api/v2/users/' + decoded_JWT.sub,
                headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
                data: {
                    user_metadata: { 
                        test_net_contract_id: contract_id,
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

    

}






  
  
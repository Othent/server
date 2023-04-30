import { warp, configureWallet } from '../warp-configs.js'
import updateDB from '../../database/updateDB.js'
import queryDB from '../../database/queryDB.js'
import jwt from 'jsonwebtoken';
import sendEmail from '../../new_user_email/email.js'


export default async function createUser(JWT) { 


    // check DB
    const checkDB = await queryDB(JWT);
    if (checkDB.response !== "user not found") {
        return checkDB.contract_id;
    }

    
    // config contract 
    const wallet = await configureWallet();
    const contract_state = { 
        App: "Othent.io", 
        Description: "Merging Web2 to Web3 user logins with a familiar and simple interface",
        user_id: null, 
        contract_address: null,
        last_nonce: null,
        JWK_public_key: null
    }


    // contract code
    let contract_code;
    try {
        contract_code = await fetch('https://othent.io/contract-new-new.js');
        contract_code = await contract_code.text();
    } catch (e) {
        return {
            error: e
        };
    }



    const createOptions = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Contract-Description", value: "Othent.io merges Web2 to Web3 user logins with a familiar and simple interface"}, 
    ]};
    let tags = createOptions.tags

    let contractTxId;
    try {
        contractTxId = await warp.deploy({
            wallet: wallet, 
            initState: JSON.stringify(contract_state), 
            src: contract_code,
            tags
        });

        contractTxId = contractTxId.contractTxId

        console.log(contractTxId)

    } catch(e) {
        console.log(e);
        return {
            error: e
        };
    }
    
    console.log('jdfjdsbfjbsdj', contractTxId);

    const contract = warp.contract(contractTxId).connect(wallet.jwk).setEvaluationOptions({internalWrites: true});

    const writeOptions = {tags: [
        {name: "Contract-App", value: "Othent.io"}, 
        {name: "Function", value: "initializeContract"}
    ]};

    try {
        await contract.writeInteraction({
            function: 'initializeContract',
            jwt: JWT,
            contract_address: contractTxId,
            encryption_type: "JWT"
        }, writeOptions);
    } catch(e) {
        return {
            error: e
        };
    }

    console.log(contractTxId);

    const decoded_JWT = jwt.decode(JWT);
    try {
        await updateDB(decoded_JWT.sub, contractTxId);
    } catch (e) {
        return {
            error: e
        };
    }

    const auth0Domain = process.env.auth0Domain;
    const auth0ClientId = process.env.auth0ClientId;
    const auth0ClientSecret = process.env.auth0ClientSecret;
    const audience = `https://${auth0Domain}/api/v2/`;
    const tokenUrl = `https://${auth0Domain}/oauth/token`;
    const tokenParams = {
        grant_type: 'client_credentials',
        client_id: auth0ClientId,
        client_secret: auth0ClientSecret,
        audience: audience
    };

    let tokenResponse;
    try {
        tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tokenParams)
        });    
    } catch (e) {
        return {
            error: e
        };
    }

    const { access_token: token } = await tokenResponse.json();

    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    let userResponse;
    try {
        userResponse = await fetch(`https://othent.us.auth0.com/api/v2/users/${decoded_JWT.sub}`, options);
    } catch (e) {
        return {
            error: e
        };
    }
    const user_data = await userResponse.json();

    try {
        if (user_data.given_name) {
            await sendEmail(user_data.email, contractTxId, user_data.given_name);
        } else {
            await sendEmail(user_data.email, contractTxId, user_data.email);
        }    
    } catch (e) {
        return {
            error: e
        };
    }

    const user_data_res = {
        success: true,
        message: 'new user created',
        email: user_data.email,
        email_verified: user_data.email_verified,
        family_name: user_data.family_name,
        given_name: user_data.given_name,
        locale: user_data.locale,
        name: user_data.name,
        nickname: user_data.nickname,
        picture: user_data.picture,
        user_id: user_data.user_id,
        contract_id: contractTxId
    };

    return user_data_res;
}

    
import Heroku from 'heroku-client';

// Othent : ifhhfh38r38fbcj in txn

// if no API keys return false as well as incorrect on package

export default async function updateHerokuKeys(API_KEY, API_ID) {

  const heroku = new Heroku({ token: process.env.heroku_api_key });
  const appName = 'othent-server';
  const key = 'API_KEYS';
  const existing_API_keys = process.env.API_KEYS;
  const parsedKeys = JSON.parse(existing_API_keys);
  parsedKeys.push({ ID: API_ID, KEY: API_KEY });
  const value = JSON.stringify(parsedKeys);
  const configVars = { [key]: value };

  heroku.patch(`/apps/${appName}/config-vars`, { body: configVars })
  .then(() => {
    console.log(`Successfully set ${key}=${value}`);
    return true
  })
  .catch((error) => {
    console.log(`Error setting ${key}=${value}: ${error.message}`);
    return false
  });
  

}
import Heroku from 'heroku-client';

// Othent : ifhhfh38r38fbcj in txn

// if no API keys return false as well as incorrect on package

export default async function updateHerokuKeys(API_KEY, API_ID) {

  const heroku = new Heroku({ token: process.env.heroku_api_key });
  const appName = 'othent-server';
  const key = 'API_KEYS';
  let existing_API_keys = process.env.API_KEYS;
  existing_API_keys = myArray.concat(API_KEY);
  console.log(existing_API_keys)
  const configVars = { [key]: existing_API_keys };

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
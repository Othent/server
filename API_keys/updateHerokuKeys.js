import Heroku from 'heroku-client';

// Othent : ifhhfh38r38fbcj in txn

// if no API keys return false as well as incorrect on package

export default async function updateHerokuKeys(API_KEY, API_ID) {

  const heroku = new Heroku({ token: process.env.heroku_api_key });
  const appName = 'othent-server';
  const key = 'API_KEYS';
  const existing_API_keys = JSON.parse(process.env.API_KEYS)
  existing_API_keys.push(API_KEY)
  const configVars = { [key]: existing_API_keys };
  heroku.patch(`/apps/${appName}/config-vars`, { body: configVars })
  .then(() => {
    return true
  })
  .catch((error) => {
    return { success: false, error: error }
  });
  

}
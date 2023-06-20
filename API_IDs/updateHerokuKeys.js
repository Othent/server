import Heroku from 'heroku-client';


export default async function updateHerokuAPIID(API_ID) {

  const heroku = new Heroku({ token: process.env.heroku_api_key });
  const appName = 'othent-server';
  const key = 'API_IDS';
  const existing_API_IDs = JSON.parse(process.env.API_IDS)
  existing_API_IDs.push(API_ID)
  const configVars = { [key]: existing_API_IDs };
  heroku.patch(`/apps/${appName}/config-vars`, { body: configVars })
  .then(() => {
    return true
  })
  .catch((error) => {
    return { success: false, error: error }
  });
  

}
import createAuth0Client from '@auth0/auth0-spa-js';
import { clientId, domain } from './auth_config.json';

const initOptions = {
  domain,
  client_id: clientId,
  redirect_uri: window.location.origin,
  responseType: 'token id_token'
};

const hookPromise = createAuth0Client(initOptions); // a promise

export default async () => {
  const auth0 = await hookPromise;
  if (
    window.location.search.includes('code=')
    && window.location.search.includes('state=')
  ) {
    try {
      console.log('--- window has auth0 data: auth0:', auth0);
      const appState = await auth0.handleRedirectCallback();
      console.log('appState after redirectCallback', appState);
      const isAuth = await auth0.isAuthenticated();
      console.log('authenticated:', isAuth);
    } catch (err) {
      console.log('window stuff error: ', err);
    }
  } else {
    console.log('no window stuff');
  }
  return auth0;
};

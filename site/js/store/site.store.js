import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import _ from 'lodash';
import redirectCallback from './clearUrlOnRedirectAuth';
import auth0FromHook           from './auth0FromHook';
import { apiPath, articleUrl } from '../utils/paths';

const stream = new ValueStream('mainStore')
  .property('auth0', null)
  .property('auth', false, 'boolean')
  .property('token', false)
  .property('account', null)
  .property('checkingAuth', false, 'boolean')
  .property('checkedAuth', false, 'boolean')
  .property('homepageArticles', [], 'array')
  .property('categories', [], 'array')
  .property('categoriesLoaded', false, 'boolean')
  .method('loadCategories', (s) => axios.get(apiPath('categories'))
    .then(({ data }) => {
      console.log('categories', data);
      s.do.setCategories(data);
      s.do.setCategoriesLoaded(true);
    }))
  .method('catForArticle', (s, a) => {
    if (!a) {
      return null;
    }
    const { directory } = a;
    return _.find(s.my.categories, { directory });
  })
  .method('loadHomepageArticles', (s) => axios.get( apiPath('homepage-articles'))
    .then(({ data }) => {
      s.do.setHomepageArticles(data);
    }))
  .property('count', 1, 'integer')
  .method('login', (store) => {
    if (!store.my.auth0) {
      console.log('no auth0');
      return;
    }
    store.my.auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  })
  .method('isAdmin', (s) => s.do.sub() === 'facebook|10156102864753942')
  .method('sub', (s) => _.get(s, 'my.account.sub', ''))
  .method('saveArticle', async (s, article) => {
    let result;
    const accessToken = s.my.token;
    const sub = s.do.sub();
    if (!(accessToken && sub)) {
      console.log('no token/sub', accessToken, sub);
      return;
    }
    /**
     * content: " Redux is synchronous; this is unrealistic as most action on the web client is not. ↵* Redux creates massive sprawl of data; ..."
     * created_at: "2019-03-29T22:51:23.955Z"
     description: ""
     directory: "articles/react"
     fileCreated: "2019-03-29T22:51:23.953Z"
     fileRevised: "2020-01-21T16:33:21.442Z"
     id: "7bab893e-0631-4d9e-b8f8-44b761a2aa6d"
     meta: {}
     onHomepage: true
     path: "articles/react/lge.md"
     published: true
     sha: null
     title: "Looking Glass Engine"
     updated_at: "2020-01-21T16:33:21.443Z"
     version: 1
     */

    try {

      console.log('======== putting path:', article.path);
      result = await axios({
        method: 'PUT',
        url: articleUrl(article.path, true),
        headers: {
          access_token: accessToken,
          sub,
        },
        data: article,
      });
    } catch (err) {
      console.log('error putting article', article, err);
    }
    return result;
  })
  .method('logout', (s) => {
    s.do.setAuth(false);
    s.do.setAccount(null);
  });

stream.do.loadCategories();
stream.do.loadHomepageArticles();

auth0FromHook().then((auth0) => {
  stream.do.setAuth0(auth0);
}).catch((err) => console.log('shouldnt get here:', err));

stream.subscribe(async (store) => {
  if (store.my.checkingAuth || store.my.checkedAuth || store.my.account || (!store.my.auth0)) return;
  if (store.my.auth === false) {
    store.do.setCheckingAuth(true);
    try {
      const isAuth = await store.my.auth0.isAuthenticated();
      store.do.setAuth(!!isAuth);
      if (isAuth) {
        const user = await store.my.auth0.getUser();
        store.do.setAccount(user); // @TODO: display
        redirectCallback();

        const token = await store.my.auth0.getTokenSilently();
        console.log('token:', token);
        stream.do.setToken(token);
      }
    } catch (err) {
      console.log('auth error:', err);
    }
    store.do.setCheckedAuth(true);
    store.do.setCheckingAuth(false);
  }
});


export default stream;

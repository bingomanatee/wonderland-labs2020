import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import _ from 'lodash';
import redirectCallback from './clearUrlOnRedirectAuth';
import auth0FromHook from './auth0FromHook';
import articleUrl from '../utils/articleUrl';

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
  .method('loadCategories', (s) => axios.get('https://wonderland-labs.herokuapp.com/api/categories')
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
  .method('loadHomepageArticles', (s) => axios.get('https://wonderland-labs.herokuapp.com/api/homepage-articles')
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
  .method('saveArticle', async (s, article, isNew) => {
    let result;
    const accessToken = s.my.token;
    const sub = s.do.sub();
    if (!(accessToken && sub)) {
      console.log('no token/sub', accessToken, sub);
      return;
    }
    /**
     * content: "[Looking Glass Engine](https://looking-glass-engine.now.sh//)(LGE) is a replacement for Redux/Saga. <sup>1</sup>↵↵Why? ↵↵* Redux is synchronous; this is unrealistic as most action on the web client is not. ↵* Redux creates massive sprawl of data; you create the submission format in one place, and the ↵* Applying a second solution (Saga, Thunk) to Redux↵* There is no allowance for the fact that most stores are based on data that must be initialized for the store to be feasible↵* The binding system for Redux -> React is just tiresome, and makes it difficult to back-track actions to their stores.↵↵## The solution↵↵LGE offers a very straightforward contract to the user. You can replace the state as the output of a function,↵OR call action setters to update specific prperties. Actions can be async/await, and can call outside functions or ↵libraries like axios to get/put data.↵# Looking Glass Engine 3.0↵   ↵# ValueStream public API↵↵There is a fairly hefty load of code under the hood of a ValueStream; however you only↵need about five hooks to use ValueStreams, which we present here. ↵↵The assumption here is that you want to create a multi value stream -- that is a stream↵with multiple values. ↵↵## *constructor*↵↵```javascript↵const myStream = new ValueStream('streamName')↵```↵Even the name is optional; if you make the unwise decision to not name your stream↵a name will be generated. ↵↵## ValueStream methods↵↵### method `property(name, value, type?)` : stream↵↵Defines a mutable property and its initial value. returns the stream - so can be curried↵#### parameter: name {string}↵↵**required!* -- the name of the parameter; must be a valid javaScript property name - an underscore or letter↵followed by zero or more letters, numbers or underscores. ↵↵#### parameter: value {variant} ↵↵**required** -- the initial value of the property. Even if you want to start a property as undefined,↵pass undefined as a parameter (or better yet null). ↵↵Note the initial value IS NOT VALIDATED BY TYPE! you can start a type-constrained↵value to null as a hint to determine whether it is dirty. ↵↵#### parameter: `type` {string} (optional)↵↵You can constrain subsequent values to conform to the type which is in fact the name of a method of ↵the (`is` library)[https://github.com/enricomarino/is] -- not to be mistaken for↵`is.js` or `is_js`. these include the expected 'integer', 'number', 'bool', 'string',↵'fn' etc.). If omitted, any value can be put into a property.↵↵### method: `method(name, fn, transact)` : stream ↵↵defines a managed action for the stream. ↵↵#### property: name {string}↵↵**required** -- the name of the method; must be a valid javaScript property name - an underscore or letter↵                followed by zero or more letters, numbers or underscores. ↵↵#### property: fn {function}↵↵**required** -- a method that operates on stream. ↵↵* This function is passed the stream as the first argument.↵* Any subsequent variables follow. (and are optional)↵* The returned value of the function is returned to the ↵  calling context. It is not used by ValueStream itself,↵  and you don't have to return any value from a method. ↵* The method can be async or synchronous, lambda or function;↵  the only constraint is that generators are not supported↵  by ValueStream at this time. ↵* You can call any methods (including your other methods)↵  of the stream argument inside the body of a custom method.↵* Errors - synchronous or asyncronous - are absorbed by the↵  ValueStream. If you want to track errors, do so indirectly↵  via the second argument to the `.subscribe(onNext, onError, onDone)`↵  method of the ValueStream.↵* you cannot re-define a method↵↵#### property: transact {boolean} [default: false]↵↵**optional** -- whether to delay broadcast of updates until↵the method is complete. This reduces the "churn" of updates↵that sub-calls would otherwise generate.↵↵***WARNING:*** applying transactional constraints to asynchronous↵methods -- or methods that await async calls or return promises --↵will freeze up your stream until the resolution of the promise. ↵(or an error is thrown.) Its better to call two transactional↵methods, one before the promise and one upon its commencement,↵to allow for the stream to operate between the initiation of ↵a promise and the completion. ↵↵*Calling a method*↵↵Methods are added to the `.do` object of your value stream.↵This is done to ensure the your methods don't conflict ↵with any internal ValueStream code now or in the future. ↵↵#### Usage Examples↵↵```javascript↵const { ValueStream } = require('./lib/index');↵↵const coordinate = new ValueStream('coord')↵  .property('x', 0, 'number')↵  .property('y', 0, 'number')↵  .method('add', (stream, x, y) => {↵    stream.do.setX(x + stream.get('x'));↵    stream.do.setY(y + stream.get('y'));↵  }, true) // transactional↵  .method('sub', (stream, x, y) => {↵    stream.do.add(-x, -y);↵    // note - even though sub is not transactional,↵    // the sub-call to add WILL be transactional.↵  })↵  .method('scale', (stream, k) => {↵    stream.do.setX(k * stream.get('x'));↵    stream.do.setY(k * stream.get('y'));↵  }, true)↵  .method('normalize', (stream) => {↵    const x = stream.get('x');↵    const y = stream.get('y');↵    const magnitude = Math.sqrt((x ** 2) + (y ** 2));↵    if (magnitude === 0) {↵      throw new Error('cannot normalize origin');↵    }↵    stream.do.scale(1 / magnitude);↵  });↵↵const sub = coordinate.subscribe(↵  ({ value }) => {↵    const { x, y } = value;↵    console.log('x:', x, 'y:', y);↵  },↵  (err) => {↵    console.log('error:', err);↵  },↵);↵↵// 'x:', 0, 'y:', 0↵↵coordinate.do.add(1, 2);↵↵// 'x:', 1, 'y:', 2↵↵coordinate.do.normalize();↵↵// x: 0.4472135954999579 y: 0.8944271909999159↵↵coordinate.do.scale(10);↵// x: 4.47213595499958 y: 8.94427190999916↵↵```↵↵### method: `subscribe(onNext, onError, onDone)`↵returns a Subscription object (with an `.unsubscribe()` method).↵↵#### property: `onNext` {function}↵↵onNext repeatedly gets the stream, every time a value is changed (or on completion↵of a transaction). To get the current values, call the stream's `.value` property or ↵`.toObject()` method - or better yet get select values manually. ↵↵ValueStream always has a values, so immediately upon subscribing `onNext` should↵get a value. ↵↵#### property: `onError` {function}↵↵This method emits a data burst when a function↵escapes a method or a user attempts to call `myStream.do.set[property]` with a value↵that violates its type constraint. note, in RXJS an error precedes the closing(completing)↵of a stream. In ValueStream, OTOH, any number of errors can be emitted ↵↵#### property: `onDone` {function}↵↵called when a ValueStream is `complete()`d. It has no parameters. ↵↵### method `complete()` :void↵↵stops the ValueStream, preventing further data from being emitted. ↵↵## Events↵↵ValueStream is an event emitter as well. This is largely identical to ↵the node eventEmitter pattern, but for economy of dependencies its ↵implemented with streams.↵↵Events are not data and don't have any direct coupling to the values ↵ValueStream monitors. They exist to allow open/indirect coupling of methods↵to situations; for instance, emitting a "sizeChange" event when↵width or height change or emitting a derived value like the sum of ↵an array property when its contents change.  ↵"
     createdAt: "2019-03-29T22:51:23.955Z"
     deletedAt: null
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
     updatedAt: "2020-01-21T16:33:21.443Z"
     version: 1
     */

    try {
      if (isNew) {
        result = await axios({
          method: 'POST',
          url: articleUrl(),
          headers: {
            access_token: accessToken,
            sub,
          },
          data: article,
        });
      } else {
        result = await axios({
          method: 'PUT',
          url: articleUrl(article),
          headers: {
            access_token: accessToken,
            sub,
          },
          data: article,
        });
      }
    } catch (err) {
      console.log('error putting article', article, err);
    }
    console.log('result:', result);
    return result;
  })
  .method('logout', (s) => {
    s.do.setAuth(false);
    s.do.setAccount(null);
    s.do.setPopupOpen(false)
      .addMethod('loadIssues', async (store) => {
        if (!store.my.sub) {
          return null;
        }
        const url = ['http://localhost:3000', 'issues', ...store.my.sub.split('|')].join('/');

        const { data } = await axios.get(url);
        store.do.setIssues(data.issues);
        store.do.setIssueStatus(data.status);
        store.do.setIssueAvailable(data.available);
        store.do.setIssueLoadState('loaded');
        return data.issues;
        // @TODO: catch errors
      });
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

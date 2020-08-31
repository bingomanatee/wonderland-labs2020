import _ from 'lodash';
import encodePath from './encodePath';

// const API_URL = 'http://localhost:3000/api';
 const API_URL = 'https://wll-rails-app.herokuapp.com/api';
const ARE = /^articles\//;
const asPath = (input, keepArticles = false) => {
  if (!input) {
    return '';
  }
  if (_.isObject(input) && input.path) {
    return asPath(input.path);
  }

  if ((keepArticles !== true) && ARE.test(input)) {
    return asPath(input.replace(ARE, ''));
  }

  return _.toString(input).replace(/\.[\w]+$/, '');
};

export function articleUrl(path, keepArticles) {
  if (!path) return `${API_URL}/articles`;
  const shortPath = encodePath(asPath(path, keepArticles));
  return `${API_URL}/articles/${shortPath}.json`;
}

export function apiPath(path) {
  return `${API_URL}/${path}`;
}

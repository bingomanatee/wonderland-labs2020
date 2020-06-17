import encodePath from './encodePath';

const API_URL = 'https://wonderland-labs.herokuapp.com/api';
const ARE = /^articles/;
const asPath = (input) => {
  if (!input) {
    return '';
  }
  if (_.isObject(input) && input.path) {
    return asPath(input.path);
  }

  if (ARE.test(input)) {
    return asPath(input.replace(ARE, ''));
  }

  return _.toString(input).replace(/\.[\w]+$/, '');
};

export default function articleUrl(path) {
  if (!path) return `${API_URL}/articles`;
  const shortPath = encodePath(asPath(path));
  return `${API_URL}/articles/${shortPath}.json`;
}

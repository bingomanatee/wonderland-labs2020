import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import _ from 'lodash';

const stream = new ValueStream('mainStore')
  .property('homepageArticles', [], 'array')
  .property('categories', [], 'array')
  .method('loadCategories', (s) => axios.get('https://wonderland-labs.herokuapp.com/api/categories')
    .then(({ data }) => {
      console.log('categories', data);
      s.do.setCategories(data);
    }))
  .method('catForArticle', (s, a) => {
    if (!a) return null;
    const { directory } = a;
    return _.find(s.my.categories, { directory });
  })
  .method('loadHomepageArticles', (s) => axios.get('https://wonderland-labs.herokuapp.com/api/homepage-articles')
    .then(({ data }) => {
      s.do.setHomepageArticles(data);
    }))
  .property('count', 1, 'integer');

stream.do.loadHomepageArticles();
stream.do.loadCategories();

export default stream;

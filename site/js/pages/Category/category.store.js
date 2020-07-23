import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import encodePath from '../../utils/encodePath';
import navStream  from '../../store/nav.store';
import { apiPath } from "../../utils/paths";
const stream = new ValueStream('catStore')
  .property('articles', [], 'array')
  .property('category', null)
  .watchFlat('category', (s, cat) => {
    if (cat) {
      console.log('--- cat store category: ', cat);
      navStream.do.setCategory(cat);
    }
  })
  .method('loadCategoryArticles', (s, path) => axios.get(
    apiPath(`categories/${path}.json`),
  )
    .then(({ data }) => {
      navStream.do.setArticle(data);
      s.do.setCategory(data);
      s.do.setArticles(data.articles);
    }));

export default stream;

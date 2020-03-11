import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import encodePath from '../../utils/encodePath';
import navStream from "../../store/nav.store";

const stream = new ValueStream('catStore')
  .property('articles', [], 'array')
  .property('category', null)
  .method('loadCategoryArticles', (s, path) => axios.get(
    `https://wonderland-labs.herokuapp.com/api/categories/${path}.json`,
  )
    .then(({ data }) => {
      console.log('articles', data);
      navStream.do.setArticle(data)
      s.do.setCategory(data);
      s.do.setArticles(data.articles);
    }));

export default stream;

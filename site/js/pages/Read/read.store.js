import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import navStream from '../../store/nav.store';

export default ({ history }) => {
  const { pathname } = history.location;
  console.log('pathname: ', pathname, 'of ', history.location);

  const ReadStore = new ValueStream('readStore')
    .property('title', '', 'string')
    .property('content', '', 'string')
    .watchFlat('pathname', 'pathnameChange')
    .method('pathnameChange', (s, newName) => {
      if (!newName) {
        return;
      }

      console.log('============== pathnameChange loading ', newName);
      const article = newName.replace('/read/', '').replace(/\.md$/, '.json');
      const url = `https://wonderland-labs.herokuapp.com/api/articles/${article}`;
      axios.get(url)
        .then(({ data }) => {
          console.log('article data: ', data);
          if (!(data && (typeof data === 'object'))) {
            return;
          }
          const { title, content } = data;
          navStream.do.setArticle(data);
          console.log('title:', title);
          s.do.setTitle(title);
          s.do.setContent(content);
        })
        .catch((err) => {
          console.log('error getting ', url, err);
        });
    })
    .property('pathname', pathname, 'string');

  ReadStore.do.pathnameChange(pathname);

  return ReadStore;
};

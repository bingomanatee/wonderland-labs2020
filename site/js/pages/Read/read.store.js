import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';
import navStream from '../../store/nav.store';
import stateStream from '../../store/site.store';
import encodePath from '../../utils/encodePath';

export default ({ history }) => {
  const { pathname } = history.location;
  console.log('pathname: ', pathname, 'of ', history.location);

  const ReadStore = new ValueStream('readStore')
    .method('goCat', (s) => {
      if (s.my.directory) {
        history.push(`/cat/${encodePath(s.my.directory)}`);
      }
    })
    .method('goHome', () => history.push('/'))
    .method('goEdit', (s) => {
      const encoded = encodeURIComponent(s.my.pathname.replace('/read/', ''));
      history.push(`/edit/${encoded}`);
    })
    .property('title', '', 'string')
    .property('content', '', 'string')
    .watchFlat('pathname', 'pathnameChange')
    .property('fileRevised', '', 'string')
    .property('category', null)
    .watchFlat('category', (s, cat) => {
      if (cat) {
        navStream.do.setCategory(cat);
      }
    })
    .property('directory', '', 'string')
    .method('pathnameChange', (s, newName) => {
      if (!newName) {
        return;
      }
      const article = newName.replace('/read/', '').replace(/\.md$/, '.json');
      const url = `https://wonderland-labs.herokuapp.com/api/articles/${article}`;
      axios.get(url)
        .then(({ data }) => {
          console.log('article data: ', data);
          if (!(data && (typeof data === 'object'))) {
            return;
          }
          const {
            title, content, fileRevised, directory,
          } = data;
          navStream.do.setArticle(data);
          console.log('title:', title);
          s.do.setTitle(title);
          s.do.setContent(content);
          s.do.setFileRevised(fileRevised);
          s.do.setDirectory(directory);

          if (stateStream.my.categoriesLoaded) {
            s.do.setCategory(stateStream.do.catForArticle(data));
          } else {
            const sub = stateStream.subscribe((ss) => {
              if (ss.my.categoriesLoaded) {
                s.do.setCategory(stateStream.do.catForArticle(data));
                sub.unsubscribe();
              }
            }, null, () => sub.unsubscribe());
          }
        })
        .catch((err) => {
          console.log('error getting ', url, err);
        });
    })
    .property('pathname', pathname, 'string');

  ReadStore.do.pathnameChange(pathname);

  return ReadStore;
};

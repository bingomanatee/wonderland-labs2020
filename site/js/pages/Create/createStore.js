import _               from 'lodash';
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios           from 'axios';
import siteStore       from '../../store/site.store';
import navStream       from '../../store/nav.store';
import { articleUrl }  from '../../utils/paths';
import lGet            from 'lodash/get';
import encodePath      from "../../utils/encodePath";

export default function makeArticleStore(params, setValue) {
  const {history} = params;
  const store = new ValueStream('article')
    .property('editing', false, 'boolean')
    .property('title', '', 'string')
    .property('content', '', 'string')
    .property('description', '', 'string')
    .property('published', true, 'boolean')
    .property('on_homepage', false, 'boolean')
    .property('directory', {})
    .property('name', '', 'string')
    .method('shortName', (s) => {
      if (!s.my.name) return '';
      return s.my.name.replace(/\..*$/, '') + '.md';
    })
    .property('confirmedPath', '')
    .property('isDuplicate', false, 'boolean')
    .method('currentPath', (s, baseUrl) => {
      const out = [s.my.directory.directory, s.do.shortName()].filter(a => a).join('/');
      if (baseUrl) {
        return encodePath(out);
      }
      return out;
    })
    .method('checkPath', async(s) => {
      const url = articleUrl(s.do.currentPath(), true);
      let result = {};
      try {
        result = await axios.get(url);
      } catch (err) {
        result.error = err;
      }

      s.do.setIsDuplicate(false);
      if (lGet(result, 'data.path', '')) {
        s.do.setIsDuplicate(true);
      }
      if (lGet(result, 'error.message')) {
        s.do.setIsDuplicate(true);
      }
      return s.my.isDuplicate;
    })
    .method('replace', (s, saveAnyway = false) => {
      if (saveAnyway) {
        s.do.submit(true);
      }
      s.do.setIsDuplicate(false);
    })
    .property('submitTried', false, 'boolean')
    .method('submit', async (s, force = false) => {
      if (s.do.hasErrors()) {
        return;
      }
      if (!force) {
        await s.do.checkPath();
        if (s.my.isDuplicate) {
          s.do.setSubmitTried(true);
          return;
        } else {
          console.log('checked duplicate - not a duplicate, saving.')
        }
      } else {
        console.log('forcing save without status check. ')
      }
      const data = s.do.submitData();
      console.log('submitting ', data, 'from ', s.value);
      siteStore.do.saveArticle(data)
        .then(() => {
          history.push('/read/' + s.do.currentPath(true));
      });
    })
    .method('submitData', (s) => ({
      title: s.my.title,
      content: s.my.content,
      name: s.do.mdName(),
      directory: s.my.directory.directory,
      description: s.my.description,
      published: s.my.published,
      on_homepage: s.my.on_homepage,
      path: s.do.dirName(),
    }))
    .method('mdName', (s) => {
      if (/.md$/i.test(s.my.name)) return s.my.name.toLowerCase();
      return `${s.my.name}.md`.toLowerCase();
    })
    .method('dirName', (s) => `${s.my.directory.directory}/${s.do.mdName()}`
      .replace(/\/\//g, '/'))
    .method('update', (s, value) => {
      const {
        title, published, content, directory, name, description, on_homepage
      } = value;
      s.do.setTitle(title);
      s.do.setContent(content);
      s.do.setPublished(published);
      s.do.setDescription(description);
      s.do.setDirectory(directory);
      s.do.setOn_homepage(on_homepage);
      s.do.setName(name);
    }, true) // note -- following methods are derivation no-ops.
    .method('titleError', (s) => {
      if (!s.my.title) {
        return 'must have title';
      }
      return false;
    })
    .method('contentError', (s) => {
      if (!s.my.content) {
        return 'must have content';
      }
      return false;
    })
    .method('descriptionError', (s) => {
      if (!s.my.description) {
        return 'must have description';
      }
      return false;
    })
    .method('directoryError', (s) => {
      if (!_.get(s.my.directory, 'directory')) {
        return 'must have directory';
      }
      return false;
    })
    .property('loading', false, 'boolean')
    .method('load', async (s, pathname) => {
      try {
        s.do.setLoading(true);
        s.do.setIsDuplicate(false);

        const article = pathname.replace('/read/', '');
        const url = articleUrl(article, true);

        const { data } = await axios.get(url);
        if (!(data && (typeof data === 'object'))) {
          return;
        }
        const {
          title, content, fileRevised, directory, on_homepage, published, description, path,
        } = data;

        s.do.setIsDuplicate(true);

        const name = path.split('/').pop().replace(/\.md$/i, '');
        let dirObj = directory;
        if (siteStore.my.categories) {
          dirObj = siteStore.my.categories.find((a) => a.directory === directory) || directory;
        }

        s.do.setTitle(title);
        s.do.setName(name);
        s.do.setContent(content);
        s.do.setDirectory(dirObj);
        s.do.setDescription(description);
        s.do.setOn_homepage(!!on_homepage);
        s.do.setPublished(!!published);
        data.directory = dirObj;
        data.name = name;
        setValue(data);
      } catch (err) {
        console.log('load error: ', err);
      }
      s.do.setLoading(false);
    })
    .method('hasErrors', (s) => (s.do.titleError() || s.do.descriptionError() || s.do.directoryError() || s.do.contentError() || s.do.nameError()))
    .method('nameError', (s) => {
      if (!s.my.name) {
        return 'must have name';
      }
      if (!/^[\w_.]+$/.test(s.my.name)) {
        return 'name must be formed from letters, numbers, underscore.';
      }
      return false;
    });

  const path = _.get(params, 'match.params.path', '');
  if (path) {
    console.log('loading article', path);
    store.do.load(decodeURIComponent(path));
  } else {
    setValue({})
  }

  return store;
}

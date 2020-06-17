import _ from 'lodash';
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import siteStore from '../../store/site.store';

export default function makeArticleStore() {
  return new ValueStream('article')
    .property('title', '', 'string')
    .property('content', '', 'string')
    .property('description', '', 'string')
    .property('published', true, 'boolean')
    .property('onHomepage', false, 'boolean')
    .property('directory', {})
    .property('name', '', 'string')
    .method('submit', async (s) => {
      if (s.do.hasErrors()) {
        console.log('has errors; not submitting');
        return;
      }

      const data = s.do.submitData();
      console.log('submitting ', data, 'from ', s.value);
      siteStore.do.saveArticle(data, true);
      // @TODO: go to page?
    })
    .method('submitData', (s) => ({
      title: s.my.title,
      content: s.my.content,
      name: s.do.mdName(),
      directory: s.my.directory.directory,
      description: s.my.description,
      published: s.my.published,
      on_homepage: s.my.onHomepage,
      path: s.do.dirName(),
    }))
    .method('mdName', (s) => {
      const { name } = s.my;

      if (/.md$/i.test(name)) return name.toLowerCase();
      return `${name}.md`.toLowerCase();
    })
    .method('dirName', (s) => `${s.my.directory.directory}/${s.do.mdName()}`
      .replace(/\/\//g, '/'))
    .method('update', (s, value) => {
      const {
        title, published, content, directory, name, description,
      } = value;
      s.do.setTitle(title);
      s.do.setContent(content);
      s.do.setPublished(published);
      s.do.setDescription(description);
      s.do.setDirectory(directory);
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
}

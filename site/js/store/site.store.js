import { ValueStream } from '@wonderlandlabs/looking-glass-engine';

const SiteStore = new ValueStream('siteStore')
  .method('inc', (s) => s.setCount(s.my.count + 1))
  .property('count', {
    start: 1,
    type: 'integer',
  });

export default SiteStore;

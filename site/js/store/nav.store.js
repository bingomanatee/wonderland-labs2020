import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import axios from 'axios';

export default new ValueStream('navStream')
  .property('category', null)
  .property('article', null);

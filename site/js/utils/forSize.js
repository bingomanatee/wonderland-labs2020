import _ from 'lodash';

export default function forSize(size, ...sizes) {
  let index = 0;

  switch (size) {
    case 'small':
      index = 0;
      break;

    case 'medium':
      index = 1;
      break;

    case 'large':
      index = 2;
      break;

    default:
      index = 1;
  }

  if (index >= sizes.length) return _.last(sizes);
  return sizes[index];
}

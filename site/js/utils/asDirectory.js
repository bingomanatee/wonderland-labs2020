import _ from 'lodash';

export default (input) => {
  if (!input) {
    return '';
  } if (_.isObject(input) && input.directory) {
    return input.directory;
  }
  return _.toString(input);
};

export default (path) => encodeURIComponent(path).replace(/\./g, '%2E');

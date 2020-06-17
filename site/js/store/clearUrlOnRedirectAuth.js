
export default () => {
  window.history.replaceState({}, document.title, window.location.pathname);
}

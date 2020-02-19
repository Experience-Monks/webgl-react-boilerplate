const queryString = require('query-string');

/**
 * getQueryFromParams
 *
 * @export
 * @param {String} prop
 * @returns
 */
export function getQueryFromParams(prop: String) {
  const params = queryString.parse(window.location.search);
  return params[prop] !== undefined ? params[prop] : false;
}

/**
 * setQuery
 *
 * @export
 * @param {String} query
 * @param {String} val
 * @param {boolean} [reload=false]
 * @returns
 */
export function setQuery(query: String, val: String, reload: boolean = false) {
  const queries = queryString.parse(window.location.search);
  const newQueries = Object.assign({}, queries, {
    [query]: val
  });
  const stringified = queryString.stringify(newQueries);

  if (reload) {
    window.location.href = `${window.location.pathname}?${stringified}`;
    return;
  }
  const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${stringified}`;
  window.history.pushState({ path: url }, '', url);
}

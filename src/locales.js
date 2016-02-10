import { trans } from './utils/locales-nl.js';

export default function(key, params) {
  if (key.indexOf('.') === -1) {
    return trans[key];
  }
  var str = key.split('.').reduce((o, i) => o[i], trans);

  if (str.indexOf('${}') !== -1) {
    return str.replace('${}', params);

  } else if (typeof params === 'object') {
    Object.keys(params).forEach(function(paramKey) {
      str = str.replace('${' + paramKey + '}', params[paramKey]);
    });
  }

  return str;
}
import { lang, trans } from './utils/locales-nl.js';

export default function(key, params) {
  if (key.indexOf('.') === -1) {
    return trans[key];
  }
  var str = key.split('.').reduce((o, i) => o[i], trans);

  if (params) {
    Object.keys(params).forEach(function(paramKey) {
      str = str.replace('${' + paramKey + '}', params[paramKey]);
    });
  }

  return str;
}
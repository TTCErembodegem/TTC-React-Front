import { trans, routes, timeAgo } from './utils/locales-nl.js';

var translate = function(key, params) {
  if (key.indexOf('.') === -1) {
    return trans[key];
  }
  var str = key.split('.').reduce((o, i) => o[i], trans);

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('${}') !== -1) {
    return str.replace('${}', params);

  } else if (typeof params === 'object') {
    Object.keys(params).forEach(function(paramKey) {
      str = str.replace('${' + paramKey + '}', params[paramKey]);
    });
  }

  return str;
};

translate.route = function(routeName, params) {
  var route = routes[routeName];
  if (!params) {
    return route;
  }

  Object.keys(params).forEach(function(paramKey) {
    route = route.replace(':' + paramKey, params[paramKey]);
  });
  return route;
};

translate.timeAgo = function() {
  return timeAgo;
};

export default translate;
import {trans, routes, timeAgo} from './utils/locales-nl.js';

var translate = function(key, params) {
  var str;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => o[i], trans);
  }

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

translate.reverseRoute = function(baseRoute, translatedRoute) {
  var result;
  Object.keys(routes[baseRoute]).forEach(key => {
    const value = routes[baseRoute][key];
    if (value === translatedRoute) {
      result = key;
    }
  });
  return result;
};

translate.route = function(routeName, params) {
  var route;
  if (routeName.indexOf('.') === -1) {
    route = routes[routeName];
  } else {
    route = routeName.split('.').reduce((o, i) => o[i], routes);
  }

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

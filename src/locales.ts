import LocalesUtils from './utils/locales-nl';

const {trans, routes, timeAgo} = LocalesUtils;

const translate = (key: string, params: any = {}): string => {
  let str;
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

  } if (typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(`\${${paramKey}}`, params[paramKey]);
    });
  }

  return str;
};

translate.reverseRoute = (baseRoute, translatedRoute) => {
  let result;
  Object.keys(routes[baseRoute]).forEach(key => {
    const value = routes[baseRoute][key];
    if (value === translatedRoute) {
      result = key;
    }
  });
  return result;
};

translate.route = (routeName: string, params) => {
  let route;
  if (routeName.indexOf('.') === -1) {
    route = routes[routeName];
  } else {
    route = routeName.split('.').reduce((o, i) => o[i], routes);
  }

  if (!params) {
    return route;
  }

  Object.keys(params).forEach(paramKey => {
    route = route.replace(`:${paramKey}`, params[paramKey]);
  });
  return route;
};

translate.timeAgo = () => timeAgo;

export default translate;

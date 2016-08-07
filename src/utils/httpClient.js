import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import querystring from 'querystring';
import assert from 'assert';
// import { util as storeUtil } from '../store.js';

const LogRequestTimes = false;

export function getUrl(path, appendApi = true) {
  assert(path[0] === '/', 'HttpClient: path passed should start with a /');
  assert(path.substring(0, 5) !== '/api/', 'HttpClient: path passed should not be prefixed with /api');
  if (appendApi) {
    path = '/api' + path;
  }
  return !DEBUG ?
    // `http://ttc-erembodegem.azurewebsites.net${path}` :
    //`http://ttc-prd.azurewebsites.net${path}` :
    `http://${location.hostname}${path}` :
    `http://localhost:49731${path}`;
  // `http://127.0.0.1:${global.server.get('port')}${path}`;
}

function bearer(req) {
  var token = localStorage.getItem('token');
  if (token) {
    req.set('Authorization', 'Bearer ' + token);
  }
}

const HttpClient = {
  download: path => {
    return request.get(getUrl(path)).use(bearer);
  },
  get: (path, qs) => {
    const fullUrl = 'GET ' + (qs ? path + '?' + querystring.encode(qs) : path);
    return Promise.try(() => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }
      return null;
    })
    .then(() => request
      .get(getUrl(path))
      .query(qs)
      .use(bearer)
      .accept('application/json')
    )
    .tap(() => {
      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }
    })
    .then(res => res.body)
    .catch(err => {
      if (err.status === 408) {
        // 408 Request Timeout: Usually mysql_max_connections = retry
        return Promise.delay(100).then(() => HttpClient.get(path, qs));
      } else {
        return Promise.reject(err);
      }
    });
  },
  post: (url, data) => {
    const fullUrl = 'POST ' + url;
    return Promise.try(() => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }
      return null;
    })
    .then(() => request
      .post(getUrl(url))
      .send(data)
      .use(bearer)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
    )
    .tap(() => {
      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }
    })
    .then(res => res.body)
    .catch(err => {
      if (err.status === 408) {
        // 408 Request Timeout: Usually mysql_max_connections = retry
        return Promise.delay(100).then(() => HttpClient.post(url, data));
      } else {
        return Promise.reject(err);
      }
    });
  },
  upload: (files, type = 'temp') => new Promise((resolve, reject) => {
    var req = request
      .post(getUrl('/upload'))
      .accept('application/json')
      .use(bearer)
      .field('uploadType', type);

    files.forEach(file => {
      req.attach(file.name, file);
    });

    req.end(function(err, res) {
      if (err || !res.ok) {
        console.log('/upload', err || '', res);
        reject();
      } else {
        resolve(res.body);
      }
    });
  }),
  uploadImage: (imageBase64, dataId, type) => new Promise((resolve, reject) => {
    request
      .post(getUrl('/upload/image'))
      .send({image: imageBase64, dataId, type})
      .use(bearer)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log('/upload/image', err || '', res);
          reject();
        } else {
          resolve(res.body);
        }
      });
  })
};

export default HttpClient;
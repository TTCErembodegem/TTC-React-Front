import request from 'superagent';
import assert from 'assert';
import { util as storeUtil } from '../store.js';

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
  get: (path, qs) => new Promise((resolve, reject) => {
    console.time(path);
    request
      .get(getUrl(path))
      //.withCredentials()
      .query(qs)
      .use(bearer)
      .accept('application/json')
      .end((err, res) => {
        console.timeEnd(path);
        if (err) {
          if (err.status === 404) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          resolve(res.body);
        }
      });
  }),
  post: (url, data) => new Promise((resolve, reject) => {
    //console.log(getUrl(url), data);
    request
      .post(getUrl(url))
      //.withCredentials()
      .send(data)
      .use(bearer)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log(url, err || '', res);
          reject();
        } else {
          resolve(res.body);
        }
      });
  }),
  upload: files => new Promise((resolve, reject) => {
    var req = request
      .post(getUrl('/upload/temp'))
      .accept('application/json')
      .use(bearer);
    //.field('uploadType', type);

    files.forEach(file => {
      req.attach(file.name, file);
    });

    req.end(function(err, res) {
      if (err || !res.ok) {
        console.log('/upload/temp', err || '', res);
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
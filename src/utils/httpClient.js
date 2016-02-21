import request from 'superagent';
import assert from 'assert';

function getUrl(path) {
  assert(path[0] === '/', 'HttpClient: path passed should start with a /');
  assert(path.substring(0, 5) !== '/api/', 'HttpClient: path passed should not be prefixed with /api');
  path = '/api' + path;
  return process.env.WEBSITE_HOSTNAME ?
    `http://${process.env.WEBSITE_HOSTNAME}${path}` :
    `http://localhost:49730${path}`;
  // `http://127.0.0.1:${global.server.get('port')}${path}`;
}

const HttpClient = {
  get: (path, qs) => new Promise((resolve, reject) => {
    request
      .get(getUrl(path))
      .query(qs)
      .accept('application/json')
      .end((err, res) => {
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
      .send(data)
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
  })
};

export default HttpClient;
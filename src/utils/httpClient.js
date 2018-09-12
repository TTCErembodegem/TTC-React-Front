import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import querystring from 'querystring';
import assert from 'assert';
import moment from 'moment';
import t from '../locales.js';

const LogRequestTimes = false;

export function getUrl(path, appendApi = true) {
  assert(path[0] === '/', 'HttpClient: path passed should start with a /');
  assert(path.substring(0, 5) !== '/api/', 'HttpClient: path passed should not be prefixed with /api');
  if (appendApi) {
    path = '/api' + path;
  }

  return location.hostname !== 'localhost' ?
    `http://${location.hostname}${path}` :
    `http://localhost:49731${path}`;
}

function bearer(req) {
  var token = localStorage.getItem('token');
  if (token) {
    req.set('Authorization', 'Bearer ' + token);
  }
}

var HttpClient = {
  download: path => {
    return request.get(getUrl(path)).accept('json').use(bearer);
  },
  get: (path, qs) => {
    const fullUrl = 'GET ' + (qs ? path + '?' + querystring.encode(qs) : path);
    return Promise.try(() => {
      if (LogRequestTimes) {
        console.time(fullUrl); // eslint-disable-line
      }
      return null;
    }).then(() => request
      .get(getUrl(path))
      .query(qs)
      .use(bearer)
      .accept('application/json')
    ).tap(() => {
      if (LogRequestTimes) {
        console.timeEnd(fullUrl); // eslint-disable-line
      }
    }).then(res => res.body, err => {
      if (err.status === 408) {
        // 408 Request Timeout: Usually mysql_max_connections = retry
        return Promise.delay(300).then(() => HttpClient.get(path, qs));
      } else {
        return Promise.reject(err);
      }
    });
  },
  post: (url, data) => {
    const fullUrl = 'POST ' + url;
    return Promise.try(() => {
      if (LogRequestTimes) {
        console.time(fullUrl); // eslint-disable-line
      }
      return null;
    }).then(() => request
      .post(getUrl(url))
      .send(data)
      .use(bearer)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
    ).tap(() => {
      if (LogRequestTimes) {
        console.timeEnd(fullUrl); // eslint-disable-line
      }
    }).then(res => res.body, err => {
      if (err.status === 408) {
        // 408 Request Timeout: Usually mysql_max_connections = retry
        return Promise.delay(300).then(() => HttpClient.post(url, data));
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
        console.error('/upload FAIL', err || '', res); // eslint-disable-line
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
          console.error('/upload/image', err || '', res); // eslint-disable-line
          reject();
        } else {
          resolve(res.body);
        }
      });
  })
};

function b64ToBlob(b64Data, contentType = '', sliceSize = 512) {
  contentType = contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function downloadExcel(respBody, fileName, addTimestampToFileName = false) {
  const blob = b64ToBlob(respBody);
  if (addTimestampToFileName) {
    fileName += ' ' + moment().format('YYYY-MM-DD') + '.xlsx';
  }

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
  }
}


HttpClient.download.playersExcel = function(fileName) {
  return HttpClient.download('/players/ExcelExport').then(res => {
    downloadExcel(res.body, fileName, true);
  });
};

//link.href = 'data:application/octet-stream;base64,' + res.body;
// --> Does not work in IE

HttpClient.download.scoresheetExcel = function(match) {
  return HttpClient.download('/matches/ExcelScoresheet/' + match.id).then(res => {
    // fileName: '{frenoyId} Sporta {teamCode} vs {theirClub} {theirTeam}.xlsx',
    var fileName = t('comp.scoresheetFileName', {
      frenoyId: match.frenoyMatchId.replace('/', '-'),
      teamCode: match.getTeam().teamCode,
      theirClub: match.getOpponentClub().name,
      theirTeam: match.opponent.teamCode,
    });

    downloadExcel(res.body, fileName);
  });
};

HttpClient.download.teamsExcel = function(fileName) {
  return HttpClient.download('/teams/ExcelExport').then(res => {
    downloadExcel(res.body, fileName, true);
  });
};

export default HttpClient;

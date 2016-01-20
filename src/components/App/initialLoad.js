import http from '../../core/HttpClient.js';

export default function(props) {
  http.get('/players')
    .then(function(data) {
      props.playersLoaded(data);
    }, function(err) {
      console.error(err);
    });

  http.get('/clubs')
    .then(function(data) {
      props.clubsLoaded(data);
    }, function(err) {
      console.error(err);
    });

  http.get('/calendar')
    .then(function(data) {
      props.calendarLoaded(data);
    }, function(err) {
      console.error(err);
    });

  http.get('/teams')
    .then(function(data) {
      props.teamsLoaded(data);
    }, function(err) {
      console.error(err);
    });
}
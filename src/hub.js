import { getUrl } from './utils/httpClient.js';

import $ from 'jquery';
window.jQuery = $;
require('ms-signalr-client');

// var connection = $.hubConnection(getUrl('/', false));
// var proxy = connection.createHubProxy('ttcHub');

// proxy.on('broadcastMessage', function(name, message) {
//   console.log('hub', name, message);
// });

// connection.start({jsonp: true})
//   .done(function() {
//     proxy.server.send('uhoh', 'wheee');
//     console.log('Now connected, connection ID=' + connection.id);
//   })
//   .fail(function() {
//     console.log('Could not connect');
//   });


  // $(function () {
  //   var chat = $.connection.ttcHub;
  //   chat.client.broadcastMessage = function (name, message) {
  //     console.log('broadcastMessage', name, message);
  //   };

  //   $.connection.hub.logging = true;
  //   $.connection.hub.start().done(function () {
  //     $('#sendmessage').click(function () {
  //       chat.server.send('name', 'essage');
  //     });
  //   });
  // });
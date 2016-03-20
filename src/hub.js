import $, { setHubPrototype } from './utils/hubProxy.js';
import { getUrl } from './utils/httpClient.js';
import store from './store.js';
import { showSnackbar } from './actions/configActions.js';

var hubReady = false;

const serverMethods = ['broadcastSnackbar'];
setHubPrototype(serverMethods);

var signalR = $.signalR;
signalR.hub = $.hubConnection(getUrl('/signalr', false), {useDefaultPath: false});
$.extend(signalR, signalR.hub.createHubProxies());

var ttcHub = $.connection.ttcHub;
ttcHub.client.broadcastSnackbar = function(message) {
  store.dispatch(showSnackbar(message));
};

$.connection.hub.logging = false;
$.connection.hub.start().done(function() {
  hubReady = true;
});

export function broadcastSnackbar(message) {
  if (hubReady) {
    ttcHub.server.broadcastSnackbar(message);
  }
}
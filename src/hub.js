import $, { setHubPrototype } from './utils/hubProxy.js';
import { getUrl } from './utils/httpClient.js';
import store from './store.js';
import { showSnackbar } from './actions/configActions.js';
import { loaded as loadedPlayer } from './actions/playerActions.js';
import { clubsLoaded, teamsLoaded } from './actions/initialLoad.js';
import { simpleLoaded as loadedMatch } from './actions/matchActions.js';

var hubReady = false;

const serverMethods = ['broadcastSnackbar', 'broadcastReload'];
setHubPrototype(serverMethods);

var signalR = $.signalR;
signalR.hub = $.hubConnection(getUrl('/signalr', false), {useDefaultPath: false});
$.extend(signalR, signalR.hub.createHubProxies());

$.connection.hub.logging = false;
$.connection.hub.start().done(function() {
  hubReady = true;
});

var ttcHub = $.connection.ttcHub;

ttcHub.client.broadcastSnackbar = function(message) {
  store.dispatch(showSnackbar(message));
};
export function broadcastSnackbar(message) {
  if (hubReady) {
    ttcHub.server.broadcastSnackbar(message);
  }
}

ttcHub.client.broadcastReload = function(type, data) {
  switch (type) {
  case 'player':
    store.dispatch(loadedPlayer(data));
    break;
  case 'match':
    store.dispatch(loadedMatch(data));
    break;
  case 'team':
    store.dispatch(clubsLoaded(data));
    break;
  case 'club':
    store.dispatch(teamsLoaded(data));
    break;
  }
};
export function broadcastReload(type, data) {
  if (hubReady) {
    ttcHub.server.broadcastReload(type, data);
  }
}
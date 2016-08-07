import $, { setHubPrototype } from './utils/hubProxy.js';
import { getUrl } from './utils/httpClient.js';
import store from './store.js';
import { showSnackbar } from './actions/configActions.js';
//import { loaded as loadedPlayer } from './actions/playerActions.js';
import * as loader from './actions/initialLoad.js';
import { matchUpdated } from './actions/matchActions.js';

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

$.connection.hub.disconnected(function() {
  hubReady = false;
});
$.connection.hub.reconnected(function() {
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

ttcHub.client.broadcastReload = function(dataType, dataId, updateType) {
  switch (dataType) {
  case 'player':
    store.dispatch(loader.fetchPlayer(dataId));
    break;
  case 'match':
    store.dispatch(loader.fetchMatch(dataId));
    if (dataId && updateType) {
      store.dispatch(matchUpdated(dataId, updateType));
    }
    break;
  case 'team':
    store.dispatch(loader.fetchTeam(dataId));
    break;
  case 'club':
    store.dispatch(loader.fetchClub(dataId));
    break;
  }
};
export function broadcastReload(dataType, dataId, updateType) {
  if (hubReady) {
    ttcHub.server.broadcastReload(dataType, dataId, updateType);
  }
}
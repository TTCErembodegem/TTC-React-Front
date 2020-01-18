import $, {setHubPrototype} from './utils/hubProxy';
import {getUrl} from './utils/httpClient';
import store from './store';
import {showSnackbar} from './actions/configActions';
import * as loader from './actions/initialLoad';
import {matchUpdated} from './actions/matchActions';

let hubReady = false;

const serverMethods = ['broadcastSnackbar', 'broadcastReload'];
setHubPrototype(serverMethods);

const {signalR} = $;
signalR.hub = $.hubConnection(getUrl('/signalr', false), {useDefaultPath: false});
$.extend(signalR, signalR.hub.createHubProxies());

$.connection.hub.logging = false;
$.connection.hub.start().done(() => {
  hubReady = true;
});

$.connection.hub.disconnected(() => {
  hubReady = false;
});
$.connection.hub.reconnected(() => {
  hubReady = true;
});

const {ttcHub} = $.connection;

ttcHub.client.broadcastSnackbar = function (message) {
  store.dispatch(showSnackbar(message));
};
export function broadcastSnackbar(message) {
  if (hubReady) {
    ttcHub.server.broadcastSnackbar(message);
  }
}

ttcHub.client.broadcastReload = function (dataType, dataId, updateType) {
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

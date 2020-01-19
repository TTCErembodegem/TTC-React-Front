import $, {setHubPrototype} from './utils/hubProxy';
import {getUrl} from './utils/httpClient';
import store from './store';
import {showSnackbar} from './actions/configActions';
import * as loader from './actions/initialLoad';
import {matchUpdated} from './actions/matchActions';

const serverMethods = ['broadcastSnackbar', 'broadcastReload'];
setHubPrototype(serverMethods);

const {signalR} = $;
signalR.hub = $.hubConnection(getUrl('/signalr', false), {useDefaultPath: false});
$.extend(signalR, signalR.hub.createHubProxies());

$.connection.hub.logging = false;
$.connection.hub.start().done(() => {
  ttcHub.ready = true;
});

$.connection.hub.disconnected(() => {
  ttcHub.ready = false;
});
$.connection.hub.reconnected(() => {
  ttcHub.ready = true;
});


export const ttcHub = {
  ready: false,
  hub: $.connection.ttcHub,
};



ttcHub.hub.client.broadcastSnackbar = (message: string): void => {
  store.dispatch(showSnackbar(message));
};


ttcHub.hub.client.broadcastReload = (dataType: 'player' | 'match' | 'team' | 'club', dataId: number, updateType?: 'score' | 'report') => {
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
    default:
  }
};

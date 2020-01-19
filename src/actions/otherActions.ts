import {ttcHub} from '../hub';

export function broadcastSnackbar(message: string) {
  if (ttcHub.ready) {
    ttcHub.hub.server.broadcastSnackbar(message);
  }
}


export function broadcastReload(dataType: 'player' | 'match' | 'team' | 'club', dataId: number, updateType?: 'score' | 'report') {
  if (ttcHub.ready) {
    ttcHub.hub.server.broadcastReload(dataType, dataId, updateType);
  }
}

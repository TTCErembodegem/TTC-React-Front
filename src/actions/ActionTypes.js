import keyMirror from 'fbjs/lib/keyMirror';

export default keyMirror({
  PLAYERS_LOADED: '',
  PLAYER_DELETED: '',
  CLUBS_LOADED: '',
  CONFIG_LOADED: '',
  TEAMS_LOADED: '',
  INITIAL_LOADED: '',

  LOGIN_SUCCESS: '',
  LOGIN_FAIL: '',
  LOGIN_LOGOUT: '',

  SHOW_SNACKBAR: '',
  CLEAR_SNACKBAR: '',
  SET_SETTING: '',

  MATCHES_LOADED: '', // TTC Erembodegem match
  READONLY_MATCHES_LOADED: '', // ReadOnly other match

  PLAYER_ACTIVE_CHANGED: '',

  BOARD_SAVED: '',
  BOARD_DELETED: '',
});

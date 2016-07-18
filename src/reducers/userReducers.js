import Immutable from 'immutable';
//import * as immutableHelpers from './immutableHelpers.js';
import * as ActionTypes from '../actions/ActionTypes.js';
import { browserHistory } from 'react-router';

import UserModel from '../models/UserModel.js';

var startState = new UserModel({
  playerId: 0,
  teams: Immutable.List([]),
  security: Immutable.List([])
});

// Security: ['CAN_MANAGETEAM']

function gotoDefaultPage() {
  browserHistory.push('/');
}

export default function user(state = startState, action = null) {
  const {type, payload} = action;
  switch (type) {
  case ActionTypes.LOGIN_SUCCESS:
    if (payload.redirect) {
      window.history.back();
    }
    localStorage.setItem('token', payload.user.token);
    return new UserModel(payload.user);

  case ActionTypes.LOGIN_FAIL:
    return startState;

  case ActionTypes.LOGIN_LOGOUT:
    gotoDefaultPage();
    localStorage.removeItem('token');
    return startState;

  default:
    return state;
  }
}
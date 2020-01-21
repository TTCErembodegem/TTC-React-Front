import Immutable from 'immutable';
import ActionTypes from '../actions/ActionTypes';
import UserModel from '../models/UserModel';

const startState = new UserModel({
  playerId: 0,
  teams: Immutable.List([]),
  security: Immutable.List([]),
});

// Security: ['CAN_MANAGETEAM']

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
      localStorage.removeItem('token');
      return startState;

    default:
      return state;
  }
}

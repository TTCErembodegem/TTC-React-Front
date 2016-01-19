import * as ActionTypes from './ActionTypes';

export function playersLoaded(data) {
  return {
    type: ActionTypes.PLAYERS_LOADED,
    payload: data
  };
}

export function clubsLoaded(data) {
  return {
    type: ActionTypes.CLUBS_LOADED,
    payload: data
  };
}

export function calendarLoaded(data) {
  return {
    type: ActionTypes.CALENDAR_LOADED,
    payload: data
  };
}
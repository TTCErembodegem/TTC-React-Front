import * as ActionTypes from './ActionTypes';

export function addTodo(text) {
  return {
    type: ActionTypes.ADD_TODO,
    payload: {
      text: text,
      completed: false
    }
  };
}

export function toggleChecked(index) {
  return {
    type: ActionTypes.TOGGLE_CHECKED,
    payload: {
      index: index
    }
  };
}

export function deleteTodo(index) {
  return {
    type: ActionTypes.DELETE_TODO,
    payload: {
      index: index
    }
  };
}

export function setFilter(filter) {
  return {
    type: ActionTypes.SET_FILTER,
    payload: filter
  };
}

export function clearTodo() {
  return {
    type: ActionTypes.CLEAR_TODO
  };
}

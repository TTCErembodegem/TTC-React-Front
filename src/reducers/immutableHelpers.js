import Immutable from 'immutable';

function replaceModel(state, model, classify) {
  var toReplaceIndex = state.findIndex(m => m.id === model.id);
  if (toReplaceIndex === -1) {
    return state.push(classify(model));
  } else {
    return state.update(toReplaceIndex, () => classify(model));
  }
}

export function merge(state, payload, classify, filter) {
  if (!payload) {
    return state;
  }
  if (state.size === 0) {
    // TODO: Free matches may be zero sized here after initial load
    // second update... crash because payload is not an array
    let result = payload;
    if (filter) {
      // if (!result.filter) {
      //   console.log('state', state);
      //   console.log('payload', payload);
      // }
      result = result.filter(filter);
    }
    return Immutable.List(result.map(classify));

  } else if (payload instanceof Array) {
    let newState = state;
    for (let i = 0; i < payload.length; i++) {
      if (!filter || filter(payload[i])) {
        newState = replaceModel(newState, payload[i], classify);
      }
    }
    return newState;

  } else if (!filter || filter(payload)) {
    let model = payload;
    return replaceModel(state, model, classify);
  }
  return state;
}

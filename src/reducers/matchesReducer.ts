import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as immutableHelpers from './immutableHelpers';
import MatchModel from '../models/MatchModel';
import { IMatch } from '../models/model-interfaces';

export const matchesSlice = createSlice({
  name: 'matches',
  initialState: [] as IMatch[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IMatch | IMatch[]>) => {
      if (!action.payload) {
        return;
      }

      const payload = Array.isArray(action.payload) ? action.payload : [action.payload];
      const matches = payload
        .filter(match => match.shouldBePlayed)
        .map(match => new MatchModel(match));

      if (state.length === 0) {
        return state.concat(matches);
      }

      matches.forEach(match => {
        const index = state.findIndex(obj => obj.id === match.id);
        if (index !== -1) {
          state[index] = match;
        } else {
          state.push(match);
        }
      });
    }
  },
});

export const { simpleLoaded } = matchesSlice.actions;

export default matchesSlice.reducer;

// export default function matches(state = [], action = null) {
//   const {type, payload} = action;
//   switch (type) {
//     case ActionTypes.MATCHES_LOADED:
//       return immutableHelpers.merge(state, payload, x => new MatchModel(x), x => x.shouldBePlayed);
//     default:
//       return state;
//   }
// }

// readonlyMatches reducer is in ./reducers.js

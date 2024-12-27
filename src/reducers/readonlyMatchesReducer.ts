import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeInStore } from './immutableHelpers';
import { IMatch } from '../models/model-interfaces';
import MatchModel from '../models/MatchModel';

export const readonlyMatchesSlice = createSlice({
  name: 'readonlyMatches',
  initialState: [] as IMatch[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IMatch | IMatch[]>) => {
      mergeInStore(state, action.payload, m => new MatchModel(m));
    },
  },
});

export const { simpleLoaded } = readonlyMatchesSlice.actions;

export default readonlyMatchesSlice.reducer;

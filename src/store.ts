import { configureStore } from '@reduxjs/toolkit';
import matchesReducer, { freeMatchesSlice } from './reducers/matchesReducer';
import configReducer from './reducers/configReducer';
import userReducer from './reducers/userReducer';
import playersReducer, { playersQuittersSlice } from './reducers/playersReducer';
import teamsReducer from './reducers/teamsReducer';
import clubsReducer from './reducers/clubsReducer';
import readonlyMatchesReducer from './reducers/readonlyMatchesReducer';

export const store = configureStore({
  reducer: {
    config: configReducer,
    user: userReducer,
    matches: matchesReducer,
    freeMatches: freeMatchesSlice.reducer,
    readonlyMatches: readonlyMatchesReducer,
    teams: teamsReducer,
    players: playersReducer,
    playersQuitters: playersQuittersSlice.reducer,
    clubs: clubsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

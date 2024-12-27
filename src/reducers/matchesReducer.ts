import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { mergeInStore2 } from './immutableHelpers';
import { IFullStoreMatchOwn, IMatchComment, IStoreMatchCommon, ITeamOpponent } from '../models/model-interfaces';
import http from '../utils/httpClient';
import { t } from '../locales';
import { showSnackbar } from './configReducer';

export const fetchMatches = createAsyncThunk(
  'matches/Get',
  async () => {
    const response = await http.get<IFullStoreMatchOwn[]>('/matches');
    return response;
  },
);

const shouldSync = (match: IStoreMatchCommon) => !match.isSyncedWithFrenoy
  && moment().isAfter(match.date)
  && match.shouldBePlayed;

export const frenoyMatchSync = createAsyncThunk(
  'matches/FrenoyMatchSync',
  async (data: {match: IStoreMatchCommon, forceSync?: boolean}, { dispatch }) => {
    if (data.forceSync || shouldSync(data.match)) {
      console.log(`FrenoySync for ${data.match.id}`);
      try {
        const newMatch = await http.post<IFullStoreMatchOwn>(`/matches/FrenoyMatchSync?forceSync=${data.forceSync || false}`, {id: data.match.id});
        dispatch(simpleLoaded(newMatch));
        // broadcastReload('match', data.match.id);
      } catch (err) {
        if (data.forceSync) {
          dispatch(showSnackbar(t('common.apiFail')));
        }
      }
    }
  },
);

export const updateScore = createAsyncThunk(
  'matches/UpdateScore',
  async (data: {matchId: number, home: number, out: number}, { dispatch }) => {
    try {
      const newMatch = await http.post<IFullStoreMatchOwn>('/matches/UpdateScore', data);
      dispatch(simpleLoaded(newMatch));
      // broadcastReload('match', data.match.id);
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const postReport = createAsyncThunk(
  'matches/Report',
  async (report: {matchId: number, text: string, playerId: number}, { dispatch }) => {
    try {
      const newMatch = await http.post<IFullStoreMatchOwn>('/matches/Report', report);
      dispatch(simpleLoaded(newMatch));
      // broadcastReload('match', newMatch.id);
      dispatch(showSnackbar(t('match.report.reportPosted')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const postComment = createAsyncThunk(
  'matches/Comment',
  async (comment: IMatchComment, { dispatch }) => {
    try {
      const newMatch = await http.post<IFullStoreMatchOwn>('/matches/Comment', comment);
      dispatch(simpleLoaded(newMatch));
      // broadcastReload('match', newMatch.id);
      dispatch(showSnackbar(t('match.report.commentPosted')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const deleteComment = createAsyncThunk(
  'matches/DeleteComment',
  async (data: {id: number}, { dispatch }) => {
    try {
      const newMatch = await http.post<IFullStoreMatchOwn>('/matches/DeleteComment', data);
      dispatch(simpleLoaded(newMatch));
      // broadcastReload('match', newMatch.id);
      dispatch(showSnackbar(t('match.report.commentDeleted')));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);


/** New season team sync */
export const frenoyTeamSync = createAsyncThunk(
  'matches/FrenoyTeamSync',
  async (data: {teamId: number}, { dispatch }) => {
    try {
      await http.post('/matches/FrenoyTeamSync', {id: data.teamId});
      dispatch(showSnackbar(`${t('common.apiSuccess')}: Duw F5 om de wijzigingen te zien`));
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
    }
  },
);

export const getOpponentMatches = createAsyncThunk(
  'matches/GetOpponentMatches',
  async (data: {teamId: number, opponent: ITeamOpponent}, { dispatch }) => {
    // try {
    //   await http.post('/matches/GetOpponentMatches');
    //   dispatch(showSnackbar(t('common.apiSuccess')));
    // } catch (err) {
    //   dispatch(showSnackbar(t('common.apiFail')));
    // }
  },
);

// export function getOpponentMatches(teamId, opponent = {}) {
//   const key = 'GetOpponentMatches' + teamId + opponent.teamCode + opponent.clubId;
//   if (storeUtil.getConfig().get(key)) {
//     return {type: 'empty', payload: ''};
//   }

//   return dispatch => {
//     return http.get('/matches/GetOpponentMatches', {teamId, ...opponent})
//       .then(function(matches) {
//         dispatch(setSetting(key, true));

//         if (!matches || !matches.length) {
//           return;
//         }

//         dispatch(readOnlyLoaded(matches));

//         matches.forEach(m => {
//           dispatch(frenoyReadOnlyMatchSync(m));
//         });
//         return null;

//       }, function(err) {
//         console.log('GetOpponentMatches!', err); // eslint-disable-line
//       });
//   };
// }


export const matchesSlice = createSlice({
  name: 'matches',
  initialState: [] as IFullStoreMatchOwn[],
  reducers: {
    simpleLoaded: (state, action: PayloadAction<IFullStoreMatchOwn | IFullStoreMatchOwn[]>) => { // eslint-disable-line arrow-body-style
      return mergeInStore2(state, action.payload, m => m.shouldBePlayed);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMatches.fulfilled, (state, action) => mergeInStore2(state, action.payload));
  },
});


// export function freeMatches(state = Immutable.List([]), action = null) {
//   const {type, payload} = action;
//   switch (type) {
//     case ActionTypes.MATCHES_LOADED:
//       return immutableHelpers.merge(state, payload, x => new MatchModel(x), x => !x.shouldBePlayed);
//     default:
//       return state;
//   }
// }


export const { simpleLoaded } = matchesSlice.actions;

export default matchesSlice.reducer;

// readonlyMatches reducer is in ./reducers.js

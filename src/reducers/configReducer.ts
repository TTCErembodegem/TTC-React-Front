/* eslint-disable object-property-newline */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import http from '../utils/httpClient';
import { t } from "../locales";

type IConfig = typeof defaultConfigState.params;

export const fetchConfig = createAsyncThunk(
  'config/Get',
  async () => {
    const response = await http.get<Omit<IConfig, 'endOfSeason'> & {endOfSeason: 'true' | 'false'}>('/config');
    return response;
  },
);

export const saveConfig = createAsyncThunk(
  'config/Save',
  async (pair: {key: string, value: string}, { dispatch }) => {
    try {
      await http.post('/config', pair);
      dispatch(showSnackbar('Parameter saved'));
      return pair;
    } catch (err) {
      dispatch(showSnackbar(t('common.apiFail')));
      console.log('saveConfigParam!', err);
      throw err;
    }
  },
);


const defaultConfigState = {
  initialLoadCompleted: false,
  params: {
    email: '', googleMapsUrl: '', location: '', trainingDays: '', competitionDays: '',
    adultMembership: '', youthMembership: '', additionalMembership: '', recreationalMembers: '',
    frenoyClubIdVttl: '', frenoyClubIdSporta: '', compBalls: '', clubBankNr: '', clubOrgNr: '',
    year: '', endOfSeason: false,
  },
  snackbar: '',
  settings: {
    container100PerWidth: false,
  },
  newMatchComments: {} as {[matchId: number]: boolean},
};

type Settings = typeof defaultConfigState.settings;
type SettingPair<K extends keyof Settings> = {
  key: K;
  value: Settings[K];
};

export const configSlice = createSlice({
  name: 'config',
  initialState: defaultConfigState,
  reducers: {
    initialLoadCompleted: state => {
      state.initialLoadCompleted = true;
    },
    clearSnackbar: state => {
      state.snackbar = '';
    },
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = action.payload;
    },
    setSetting: <K extends keyof Settings>(state: typeof defaultConfigState, action: PayloadAction<SettingPair<K>>) => {
      const {key, value} = action.payload;
      state.settings[key] = value;
    },
    setNewMatchComment: (state, action: PayloadAction<{matchId: number, isNew: boolean}>) => {
      const {matchId, isNew} = action.payload;
      state.newMatchComments[matchId] = isNew;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.params = {
        ...action.payload,
        endOfSeason: action.payload.endOfSeason === 'true',
      };
    });

    builder.addCase(saveConfig.fulfilled, (state, action) => {
      state.params[action.payload.key] = action.payload.value;
    });
  },
});

export const { initialLoadCompleted, clearSnackbar, showSnackbar, setSetting, setNewMatchComment } = configSlice.actions;

export default configSlice.reducer;

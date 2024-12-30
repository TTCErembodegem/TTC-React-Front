import { useEffect } from 'react';
import { fetchClubs } from '../reducers/clubsReducer';
import { useTtcDispatch, useTtcSelector } from './hooks/storeHooks';
import { fetchConfig, initialLoadCompleted } from '../reducers/configReducer';
import { fetchPlayers } from '../reducers/playersReducer';
import { fetchTeams, loadTeamRanking } from '../reducers/teamsReducer';
import { fetchMatches, frenoyMatchSync } from '../reducers/matchesReducer';


export const useInitialLoad = () => {
  const dispatch = useTtcDispatch();
  const user = useTtcSelector(state => state.user.playerId);
  const isLoaded = useTtcSelector(state => state.config.initialLoadCompleted);
  const matches = useTtcSelector(state => state.matches);
  const teams = useTtcSelector(state => state.teams);

  useEffect(() => {
    const initialLoad = async () => {
      await Promise.all([
        dispatch(fetchClubs()).unwrap(),
        dispatch(fetchConfig()).unwrap(),
        dispatch(fetchPlayers()).unwrap(),
        dispatch(fetchTeams()).unwrap(),
        dispatch(fetchMatches()).unwrap(),
      ]);
    };
    initialLoad().then(() => {
      console.log('Initial Load Complete');
      dispatch(initialLoadCompleted());
    });
  }, [user]);

  useEffect(() => {
    if (isLoaded) {
      console.log('Secondary load started');
      teams.forEach(team => {
        if (!team.ranking || team.ranking.length === 0) {
          dispatch(loadTeamRanking({teamId: team.id}));
        }
      });

      matches.forEach(match => {
        dispatch(frenoyMatchSync({match}));
      });
    }
  }, [isLoaded]);
};

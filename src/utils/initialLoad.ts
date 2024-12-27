import { useEffect } from 'react';
import { fetchClubs } from '../reducers/clubsReducer';
import { useTtcDispatch, useTtcSelector } from './hooks/storeHooks';
import { fetchConfig, initialLoadCompleted } from '../reducers/configReducer';
import { fetchPlayers } from '../reducers/playersReducer';
import { fetchTeams } from '../reducers/teamsReducer';
import { fetchMatches, frenoyMatchSync } from '../reducers/matchesReducer';


export const useInitialLoad = () => {
  const dispatch = useTtcDispatch();
  const user = useTtcSelector(state => state.user.playerId);
  const isLoaded = useTtcSelector(state => state.config.initialLoadCompleted);
  const matches = useTtcSelector(state => state.matches);

  useEffect(() => {
    // TODO: on initialLoad failure, show a snackbar:
    // dispatch(showSnackbar('TTC data kon niet geladen worden'));
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
      // TODO: loadTeamRankings() for teams

      matches.forEach(match => {
        dispatch(frenoyMatchSync({match}));
      });
    }
  }, [isLoaded]);
};


//   function loadTeamRankings(data, dispatch) {
//     var p = Promise.resolve();
//     if (!data) {
//       return p;
//     }
//     data.forEach(team => {
//       if (!team.ranking || team.ranking.length === 0) {
//         p = p.then(function() {
//           return http.get('/teams/Ranking', {teamId: team.id})
//             .then(function(newTeam) {
//               dispatch(teamsLoaded(newTeam));
//               return null;
//             }, function(err) {
//               console.error(err); // eslint-disable-line
//             });
//         });
//       }
//     });
//     return p;
//   }

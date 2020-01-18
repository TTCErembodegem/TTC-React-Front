import store from './store';
import {OwnClubId} from './models/ClubModel';
import {getRankingValue} from './models/utils/playerRankingValueMapper';

export function getOpponentMatchesForTeam(competition, clubId, teamCode) {
  return store.getState().readonlyMatches
    .filter(m => m.competition === competition)
    .filter(m => m.home && m.away)
    .filter(m => (m.home.clubId === clubId && m.home.teamCode === teamCode) || (m.away.clubId === clubId && m.away.teamCode === teamCode))
    .filter(m => m.shouldBePlayed)
    .sort((a, b) => a.date - b.date);
}


const createKey = form => form.reduce((key, f) => key + f.amount + f.ranking, '');

export function getOpponentFormations(matches, opponent) {
  return matches.filter(match => match.isSyncedWithFrenoy).reduce((acc, match) => {
    let isHomeTeam;
    if (!opponent) {
      isHomeTeam = true;
    } else {
      isHomeTeam = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
    }
    const formation = getMatchPlayerRankings(match, isHomeTeam);

    const exists = acc.find(form => form.key === createKey(formation));
    if (!exists) {
      acc.push({
        key: createKey(formation),
        details: formation,
        amount: 1,
        value: formation.reduce((total, {ranking, amount}) => total + (amount * getRankingValue(match.competition, ranking)), 0),
      });

    } else {
      exists.amount++;
    }
    return acc;
  }, []);
}


const unique = (value, index, self) => self.indexOf(value) === index;

export function getMatchPlayerRankings(match, homeTeam) {
  let opponentFormation;
  if (homeTeam) {
    opponentFormation = match.players.filter(m => m.home);
  } else {
    opponentFormation = match.players.filter(m => !m.home);
  }
  const rankings = opponentFormation.map(ply => ply.ranking);
  const diffs = rankings.toArray().filter(unique);
  return diffs.map(ranking => ({
    ranking,
    amount: rankings.reduce((prev, cur) => prev + (cur === ranking ? 1 : 0), 0),
  }));
}




function getOpponentMatches(match, opponent = undefined) {
  opponent = opponent || match.opponent;
  const matches = store.getState().readonlyMatches
    .filter(x => x.competition === match.competition && x.frenoyDivisionId === match.frenoyDivisionId);

  return {
    home: matches.filter(m => m.home.clubId === opponent.clubId && m.home.teamCode === opponent.teamCode),
    away: matches.filter(m => m.away.clubId === opponent.clubId && m.away.teamCode === opponent.teamCode),
  };
}

const util = {
  getConfig() {
    return store.getState().config;
  },
  getUser() {
    return store.getState().user;
  },
  getUserPlayer() {
    return util.getPlayer(util.getUser().playerId);
  },

  getTeam(teamId) {
    const {teams} = store.getState();
    return teams.find(team => team.id === teamId);
  },
  getTeams() {
    return store.getState().teams;
  },

  getClub(clubId) {
    const {clubs} = store.getState();
    return clubs.find(club => club.id === clubId);
  },
  getOwnClub() {
    return util.getClub(OwnClubId);
  },

  getPlayer(playerId) {
    const {players} = store.getState();
    return players.find(ply => ply.id === playerId);
  },

  getMatch(matchId) {
    const {matches} = store.getState();
    return matches.find(match => match.id === matchId);
  },
  getMatches() {
    return store.getState().matches;
  },

  matches: {
    getTodayMatches() {
      return util.getMatches().filter(cal => cal.isBeingPlayed());
    },
    getFromOpponent(match) {
      const result = getOpponentMatches(match);
      return result.away.concat(result.home);
    },

    getAllMatches() {
      return util.getMatches();
    },

    getFormation(match, opponent = undefined) {
      const matches = getOpponentMatches(match, opponent);
      let opponentPlayers = matches.home.map(m => m.players).flatten().filter(m => m.home);
      opponentPlayers = opponentPlayers.concat(matches.away.map(m => m.players).flatten().filter(m => !m.home));

      // TODO: this assumes that if you forfeited, you lost that match (ply has won but not lost property)
      // could be calculated more correctly by looking at the individual match results
      // --> Now it looks like Aaigem A (Sporta A) won those 9 matches (Guido, Ivo, Paul) +3 matches each that do not show up on Frenoy
      const result = {};
      opponentPlayers.forEach(ply => {
        if (result[ply.uniqueIndex]) {
          result[ply.uniqueIndex].count++;
          result[ply.uniqueIndex].won += +ply.won || 0;

        } else {
          result[ply.uniqueIndex] = {
            player: ply,
            count: 1,
            won: +ply.won || 0,
          };
        }
      });

      const matchesPerPlayer = match.getTeamPlayerCount();
      return Object.values(result).map(ply => Object.assign(ply, {lost: (matchesPerPlayer * ply.count) - ply.won}));
    },
  },
};

export default util;

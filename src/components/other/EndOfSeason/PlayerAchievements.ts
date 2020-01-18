import {getRankingValue} from '../../../models/utils/playerRankingValueMapper';
import storeUtil from '../../../storeUtil';

const getPerGames = cur => Math.floor(cur.victories / cur.games * 1000) / 10;


export function getMostMatchesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => (acc.victories > cur.victories ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.victories === highest.victories);

  return {
    title: 'Krijgsheer',
    desc: 'Meest aantal gewonnen matchen',
    players: players.map(cur => ({
      throphy: `${cur.victories} gewonnen matchen`,
      player: cur.ply,
    })),
  };
}



export function getMostMatchesPercentageWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.games) {
      return cur;
    }
    if (!cur.games) {
      return acc;
    }
    return getPerGames(acc) > getPerGames(cur) ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => getPerGames(cur) === getPerGames(highest));
  return {
    title: 'The Destroyer',
    desc: 'Hoogst % gewonnen matchen',
    players: players.map(cur => ({
      throphy: `${getPerGames(cur)}% gewonnen`,
      player: cur.ply,
    })),
  };
}




export function getRankingDestroyer(competition, playerStats) {
  const getValue = r => getRankingValue(competition, r);

  const result = playerStats.map(ps => {
    const ownRanking = ps.ply.getCompetition(competition).ranking;
    const ownValue = getValue(ownRanking);

    const highestWon = Object.entries(ps.won).reduce((acc, [ranking]) => (getValue(acc) > getValue(ranking) ? acc : ranking), 'NG');

    return {
      player: ps.ply,
      difference: getValue(highestWon) - ownValue,
      throphy: `${ownRanking} vs ${ps.won[highestWon]}x${highestWon}`,
    };
  });

  const highest = result.reduce((acc, cur) => (acc.difference > cur.difference ? acc : cur), result[0]);

  const players = result.filter(cur => cur.difference === highest.difference);

  return {
    title: 'Klassement Vernietiger',
    desc: 'Grootste klassement verschil',
    players: players.map(cur => ({
      throphy: cur.throphy,
      player: cur.player,
    })),
  };
}




export function getMostBellesPlayed(playerStats) {
  const highest = playerStats.reduce((acc, cur) => (acc.belleGames > cur.belleGames ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.belleGames === highest.belleGames);
  return {
    title: 'Grootste uitslover',
    desc: 'Meeste belles gespeeld',
    players: players.map(cur => ({
      throphy: `${cur.belleGames} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}



export function getMostBellesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => (acc.belleVictories > cur.belleVictories ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.belleVictories === highest.belleVictories);
  return {
    title: 'Meest Koelbloedig',
    desc: 'Meeste belles gewonnen',
    players: players.map(cur => ({
      throphy: `${cur.belleVictories} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}


export function getMostBellesPercentageWon(playerStats) {
  const getPer = cur => Math.floor(cur.belleVictories / cur.belleGames * 1000) / 10;

  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.belleGames) {
      return cur;
    }
    if (!cur.belleGames) {
      return acc;
    }
    return getPer(acc) > getPer(cur) ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => getPer(cur) === getPer(highest));
  return {
    title: 'Onderste uit de kan',
    desc: 'Meeste belles % gewonnen',
    players: players.map(cur => ({
      throphy: `${getPer(cur)}% gewonnen belles (${cur.belleGames} belles)`,
      player: cur.ply,
    })),
  };
}



export function getMostBellesPercentageLost(playerStats) {
  const getPer = cur => Math.floor(cur.belleVictories / cur.belleGames * 1000) / 10;

  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.belleGames) {
      return cur;
    }
    if (!cur.belleGames) {
      return acc;
    }
    if (getPer(acc) === getPer(cur)) {
      return acc.belleGames > cur.belleGames ? acc : cur;
    }
    return getPer(acc) < getPer(cur) ? acc : cur;
  }, playerStats[0]);

  return {
    title: 'Grootste Pechvogel',
    desc: 'Meest verloren belles',
    players: [{
      throphy: `${getPer(highest)}% gewonnen belles (${highest.belleGames} gespeeld)`,
      player: highest.ply,
    }],
  };
}



export function getMostGamesPlayer(playerStats) {
  const highest = playerStats.reduce((acc, cur) => (acc.games > cur.games ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.games === highest.games);
  return {
    title: 'Altijd Paraat',
    desc: 'Meeste aantredingen',
    players: players.map(cur => ({
      throphy: `${cur.games} aantredingen (${Math.floor(cur.victories / cur.games * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}


export function getMostNetjesTegen(playerStats) {
  const gerdo = playerStats.find(x => x.ply.alias === 'Gerdo');
  return {
    title: 'Meeste netjes tegen',
    desc: '',
    players: [{
      throphy: '+Infinity',
      player: gerdo.ply,
    }],
  };
}


export function getMostMatchesAllWon(competition, playerStats, matches) {
  // const xxx = matches.toArray()[0].getGameMatches();
  // console.log('getGameMAtches', xxx.toArray());
  // console.log('getOwnPlayers', matches.toArray()[0].getOwnPlayers().toArray());

  const toWinCount = matches.first().getTeamPlayerCount();

  const playerIds = matches.reduce((acc, cur) => {
    const fullWin = cur.getOwnPlayers().filter(p => p.won === toWinCount).toArray();
    if (fullWin.length) {
      acc = acc.concat(fullWin.map(p => p.playerId));
    }
    return acc;
  }, []);


  const playerWins = playerIds.reduce((acc, id) => {
    let existing = acc.find(x => x.id === id);
    if (!existing) {
      existing = {id, ply: storeUtil.getPlayer(id), wins: 0};
      acc.push(existing);
    }
    existing.wins++;
    return acc;
  }, []);


  playerWins.sort((a, b) => b.wins - a.wins);


  const highest = playerWins.reduce((acc, cur) => (acc.wins > cur.wins ? acc : cur), playerWins[0]);

  const players = playerWins.filter(cur => cur.wins === highest.wins);
  return {
    title: 'Topdagen',
    desc: '',
    players: players.map(cur => ({
      throphy: `${cur.wins} matchen alle ${toWinCount} gewonnen`,
      player: cur.ply,
    })),
  };
}


export default {
  Vttl: [
    getMostMatchesWon,
    getMostMatchesPercentageWon,
    getMostGamesPlayer,
    getRankingDestroyer.bind(this, 'Vttl'),
    getMostMatchesAllWon.bind(this, 'Vttl'),
    getMostNetjesTegen,
  ],
  Sporta: [
    getMostMatchesWon,
    getMostMatchesPercentageWon,
    getMostGamesPlayer,
    getRankingDestroyer.bind(this, 'Sporta'),
    getMostMatchesAllWon.bind(this, 'Vttl'),
  ],
  belles: [
    getMostBellesWon,
    getMostBellesPercentageWon,
    getMostBellesPercentageLost,
    getMostBellesPlayed,
  ],
};

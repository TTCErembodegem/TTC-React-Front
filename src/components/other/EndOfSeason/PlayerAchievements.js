const getPerGames = cur => Math.floor(cur.victories / cur.games * 1000) / 10;


export function getMostMatchesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.victories > cur.victories ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => cur.victories === highest.victories);

  return {
    title: 'Krijgsheer',
    desc: 'Meest aantal gewonnen matchen',
    players: players.map(cur => ({
      throphy: `${cur.victories} gewonnen matchen`,
      player: cur.ply,
    }))
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
    }))
  };
}






export function getMostBellesPlayed(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.belleGames > cur.belleGames ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => cur.belleGames === highest.belleGames);
  return {
    title: 'Grootste uitslover',
    desc: 'Meeste belles gespeeld',
    players: players.map(cur => ({
      throphy: `${cur.belleGames} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
      player: cur.ply,
    }))
  };
}



export function getMostBellesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.belleVictories > cur.belleVictories ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => cur.belleVictories === highest.belleVictories);
  return {
    title: 'Meest Koelbloedig',
    desc: 'Meeste belles gewonnen',
    players: players.map(cur => ({
      throphy: `${cur.belleVictories} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
      player: cur.ply,
    }))
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
    }))
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
    }]
  };
}



export function getMostGamesPlayer(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.games > cur.games ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => cur.games === highest.games);
  return {
    title: 'Altijd Paraat',
    desc: 'Meeste aantredingen',
    players: players.map(cur => ({
      throphy: `${cur.games} aantredingen (${Math.floor(cur.victories / cur.games * 100)}% gewonnen)`,
      player: cur.ply,
    }))
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
    }]
  };
}


export function getTopRankedTeams(playerStats, teams) {
  return teams.reduce((acc, cur) => {
    const ranking = cur.getDivisionRanking();
    if (ranking.position === 1) {
      acc.push(cur);
    }
    return acc;
  }, [])
    .map(topTeam => {
      return {
        title: 'De Kampioenen',
        desc: 'Eerste in de rangschikking',
        throphy: '',
        team: topTeam,
      };
    });
}


export default {
  getTopRankedTeams,
  Vttl: [
    getMostMatchesWon,
    getMostMatchesPercentageWon,
    getMostGamesPlayer,
    getMostNetjesTegen,
  ],
  Sporta: [
    getMostMatchesWon,
    getMostMatchesPercentageWon,
    getMostGamesPlayer,
  ],
  belles: [
    getMostBellesWon,
    getMostBellesPercentageWon,
    getMostBellesPercentageLost,
    getMostBellesPlayed,
  ],
};

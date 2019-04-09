export function getMostMatchesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.victories > cur.victories ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return cur.victories === highest.victories;
  })
    .map(cur => {
      return {
        title: 'Krijgsheer',
        desc: 'Meest aantal gewonnen matchen',
        throphy: `${cur.victories} gewonnen matchen`,
        player: cur.ply,
      };
    });
}



export function getMostMatchesPercentageWon(playerStats) {
  const getPer = cur => Math.floor(cur.victories / cur.games * 1000) / 10;

  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.games) {
      return cur;
    }
    if (!cur.games) {
      return acc;
    }
    return getPer(acc) > getPer(cur) ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return getPer(cur) === getPer(highest);
  })
    .map(cur => {
      return {
        title: 'The Destroyer',
        desc: 'Hoogst % gewonnen matchen',
        throphy: `${getPer(cur)}% gewonnen`,
        player: cur.ply,
      };
    });
}






export function getMostBellesPlayed(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.belleGames > cur.belleGames ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return cur.belleGames === highest.belleGames;
  })
    .map(cur => {
      return {
        title: 'Grootste uitslover',
        desc: 'Meeste belles gespeeld',
        throphy: `${cur.belleGames} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
        player: cur.ply,
      };
    });
}



export function getMostBellesWon(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.belleVictories > cur.belleVictories ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return cur.belleVictories === highest.belleVictories;
  })
    .map(cur => {
      return {
        title: 'Meest Koelbloedig',
        desc: 'Meeste belles gewonnen',
        throphy: `${cur.belleVictories} belles (${Math.floor(cur.belleVictories / cur.belleGames * 100)}% gewonnen)`,
        player: cur.ply,
      };
    });
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

  return playerStats.filter(cur => {
    return getPer(cur) === getPer(highest);
  })
    .map(cur => {
      return {
        title: 'Onderste uit de kan',
        desc: 'Meeste belles % gewonnen',
        throphy: `${getPer(cur)}% gewonnen belles (${cur.belleGames} belles)`,
        player: cur.ply,
      };
    });
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
    throphy: `${getPer(highest)}% gewonnen belles (${highest.belleGames} gespeeld)`,
    player: highest.ply,
  };
}



export function getMostGamesPlayer(playerStats) {
  const highest = playerStats.reduce((acc, cur) => {
    return acc.games > cur.games ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return cur.games === highest.games;
  })
    .map(cur => {
      return {
        title: 'Altijd Paraat',
        desc: 'Meeste aantredingen',
        throphy: `${cur.games} aantredingen (${Math.floor(cur.victories / cur.games * 100)}% gewonnen)`,
        player: cur.ply,
      };
    });
}


export function getMostNetjesTegen(playerStats) {
  const gerdo = playerStats.find(x => x.ply.alias === 'Gerdo');
  return {
    title: 'Meeste netjes tegen',
    desc: '',
    throphy: '+Infinity',
    player: gerdo.ply,
  };
}


export default {
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

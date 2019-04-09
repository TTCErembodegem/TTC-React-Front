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
        throphy: `${getPer(cur)}% gewonnen`,
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
    return getPer(acc) < getPer(cur) ? acc : cur;
  }, playerStats[0]);

  return playerStats.filter(cur => {
    return getPer(cur) === getPer(highest);
  })
    .map(cur => {
      return {
        title: 'Grootste Pechvogel',
        desc: 'Meest verloren belles',
        throphy: `${getPer(cur)}% gewonnen (${cur.belleGames} gespeeld)`,
        player: cur.ply,
      };
    });
}






export function getMostNetjesTegen() {
  return {
    title: 'Meeste netjes tegen',
    desc: '',
    throphy: '+Infinity',
    player: {name: 'Gerdo'},
  };
}


export default [
  getMostMatchesWon,
  getMostMatchesPercentageWon,
  getMostBellesWon,
  getMostBellesPercentageWon,
  getMostBellesPercentageLost,
  getMostBellesPlayed,
  getMostNetjesTegen,
];

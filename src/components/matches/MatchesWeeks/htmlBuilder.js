import {getOpponentFormations, getOpponentMatchesForTeam} from '../../../storeUtil';
import {getPlayerStats} from '../../../models/TeamModel';
import {getRankingDestroyer} from '../../other/EndOfSeason/PlayerAchievements';

export function buildHtml(user, compFilter, matches, prevMatches) {
  // console.log('m', matches.sort((a, b) => a.date - b.date).toArray());

  let html = getEndearment(compFilter);
  html += '<br>';

  // Matches
  html += getMatches(matches.toArray(), compFilter);

  if (prevMatches.size) {
    html += getPrevMatches(prevMatches);
  }

  html += getWhatToExpect(matches);

  // Signature
  // console.log('user', user);

  html += 'Veel succes iedereen!';
  // TODO: random pingpong quote

  html += '<br>';
  html += '<br>';
  html += 'Mvg,';
  html += '<br>';
  html += user.alias;

  return html;
}



function getWhatToExpect(matches) {
  let html = '';
  html += '<br><br><br>';
  html += '<b>😂 Wat deze week te verwachten 😱</b>';
  html += '<br><br>';

  matches.sort((a, b) => a.getTeam().teamCode.localeCompare(b.getTeam().teamCode)).forEach(match => {
    const opponent = match.opponent;
    const theirMatches = getOpponentMatchesForTeam(match.competition, opponent.clubId, opponent.teamCode);
    const formations = getOpponentFormations(theirMatches, opponent);

    if (formations.length) {
      const ownTitle = `<b>${match.competition} ${match.getTeam().teamCode}</b>`;
      const theirTitle = match.renderOpponentTitle();
      if (match.isHomeMatch) {
        html += `${ownTitle} vs ${theirTitle}`;
      } else {
        html += `${theirTitle} vs ${ownTitle}`;
      }
      html += ':<br>';

      // const maxValue = Math.max.apply(null, formations.map(f => f.value));
      html += 'Waarde Opstellingen: ';

      html += formations.sort((a, b) => b.value - a.value).map(formation => {
        const klassementen = formation.details.map(f => {
          return (f.amount > 1 ? f.amount + 'x' : '') + f.ranking;
        }).join(', ');

        return `${formation.amount}x[<small>${klassementen}</small>]`;
      }).join(' — ');

      // console.log('formz', formations);

      html += '<br><br>';
    }
  });

  return html;
}





const opponentBeatings = [
  {fromSporta: 8, fromVttl: 16, words: [
    'verplettert', 'vernietigt', 'vermorzelt', 'liquideert',
    '{ere} slacht {opp} af met {score}',
    '{ere} maakt {opp} kapot met {score}',
    'decimeert', 'kraakt', 'overdondert',
    '{ere} richt {opp} met {score} ten gronde',
    'butchert', // TODO: {withPlayerId: 'patrick', text: 'butchert'}
    'verbrijzelt', 'verwoest', 'sloopt',
    '{ere} vaagt {opp} met de grond gelijk ({score})',
    'vernielt', 'termineert', 'verbouwt',
    '{ere} maakt {opp} koud met {score}',
    'verdelgt', 'onthoofd',
    '👞 👞 👞', '🔪 🔪 🔪', '💣 💣 💣', '🍗 🍖 🍗',
    '🍻 🍺 🍻', '🎯 🎯 🎯', '💥 💥 💥', '✨ ✨ ✨',
    '🔥 🔥 🔥', '🌠 🌠 🌠', '🎉 🎉 🎉', '💰 💰 💰',
    '💸 💸 💸', '🔨 🔨 🔨', '⚔ ⚔ ⚔', '🏆 🏆 🏆',
    '🔫 🔫 🔫', '✂ ✂ ✂', '📯 📯 📯', '🔔 🔔 🔔',
  ]},
  {fromSporta: 6, fromVttl: 9, firstWordChance: 90, words: [
    'verslaat',
    '{ere} doet wat het moet tegen {opp} ({score})',
  ]},
  {fromSporta: 5, fromVttl: 8, words: [
    '{ere} speelt gelijk tegen {opp}',
    '{ere} met de hakken over de sloot tegen {opp}',
    '{ere} haalt een puntje binnen tegen {opp}',
    '💓',
  ]},
  // {fromSporta: 1, fromVttl: 1, words: ['verliest van']},
  // De man met de hamer tegenkomen.
];

const scoreZero = ['💉', '⚰', '⚱', '🚬', '💊', '🔒', '💔', '💢', '💤', '💭', '🔇', '☢', '☣', '🔃'];

/**
 * Vorige speelweek:
 * Sporta C (Martijn, Andy, Guy) verplettert Lokomotiv B (10-0)
 * Sporta E wint van Teneramonda C (Daniel wint 3x)
 * Sporta D vs Bernardus E: Bart wint 3x
 */
function getPrevMatches(matches) {
  let html = '';
  html += '<br><br>';
  html += '<b>Vorige Speelweek</b>';
  html += '<br>';

  const sortOnOwnScore = (a, b) => {
    const aWon = a.isHomeMatch ? a.score.home : a.score.out;
    const bWon = b.isHomeMatch ? b.score.home : b.score.out;
    return bWon - aWon;
  };


  // How did the teams perform:
  matches.sort(sortOnOwnScore).forEach(match => {
    const ownTeamUrl = getFullUrl(`/match/${match.id}`);
    const ownTeam = `<a href="${ownTeamUrl}">${match.competition} ${match.getTeam().teamCode}</a>`;
    const theirTeam = match.renderOpponentTitle();

    let scorePrinted = false;

    const ourScore = match.isHomeMatch ? match.score.home : match.score.out;
    if (ourScore === 0) {
      html += `${theirTeam} ${(getRandom(scoreZero) + ' ').repeat(3)} arm ${ownTeam}`;

    } else if (ourScore < match.getTeam().getScoreCount() / 2) {
      html += `<small>${ownTeam} verliest van ${theirTeam} (${match.renderScore()})</small>`;
      scorePrinted = true;

    } else {
      if (ourScore === match.getTeam().getScoreCount()) {
        html += '💯 ';
      }

      const beatings = opponentBeatings.find(b => ourScore >= b['from' + match.competition]);
      let beating = getRandom(beatings.words);
      if (beatings.firstWordChance && (Math.random() * 100) <= beatings.firstWordChance) {
        beating = beatings.words[0];
      }

      if (!beating.includes('{ere}')) {
        html += `${ownTeam} ${beating} ${theirTeam}`;
      } else {
        if (beating.includes('{score}')) {
          scorePrinted = true;
        }
        html += beating.replace('{ere}', ownTeam).replace('{opp}', theirTeam).replace('{score}', match.renderScore());
      }
    }

    if (!scorePrinted) {
      html += ` (${match.renderScore()})`;
    }
    html += '<br>';
  });


  // How did the players perform?
  html += '<br>';
  html += '<b>Individueel</b>';
  html += '<br>';

  const stats = getPlayerStats(matches);
  // console.log('stats', stats);

  // Players that won all matches
  const gamesToBePlayed = matches.first().getTeam().getTeamPlayerCount();
  const allWon = stats.filter(s => s.victories === gamesToBePlayed).map(s => s.ply.alias);
  if (allWon.length) {
    html += '👍 ' + allWon.join(', ');
  }


  // Players that beat a higher ranked player
  const beaten = getRankingDestroyer(matches.first().competition, stats);
  if (beaten.players.length) {
    html += '<br>';
    html += 'Mooiste overwinning: ';
    html += beaten.players.map(ply => `${ply.player.alias} ${ply.throphy}`).join(', ');
  }
  // console.log('uhoh', beaten);

  return html;
}




/**
 * Eexample:
 *
 * maa 16/9
 * Sporta A vs St Niklase A (Jorn, Wouter, Arne)
 * Sporta B vs St Niklase B (Patrick, Dirk DS, ???)
 * Hamme D vs Sporta C (Dries, Andy, Martijn)
 * Teneramonda B vs Sporta D (Jean-Pierre, Dirk VK, Thierry) - om 20u15 (match.isStandardStartTime())
 * don 19/9
 * St Pauwels B vs Sporta E (Daniel, Kenneth, Willem-Jan)
 */
function getMatches(matches, compFilter) {
  let html = '';
  let lastMatch = matches[0].date.clone().subtract(1, 'day');

  matches.forEach(match => {
    if (!lastMatch.isSame(match.date, 'day')) {
      html += '<br>';
      html += match.date.format('ddd D/M');
      html += '<br>';
      lastMatch = match.date;
    }

    const ownTitle = `<b>${getTeamLink(match)}</b>`;
    const theirTitle = getOpponentLink(match);
    if (match.isHomeMatch) {
      html += `${ownTitle} vs ${theirTitle}`;
    } else {
      html += `${theirTitle} vs ${ownTitle}`;
    }

    html += ' (';
    const formation = match.getPlayerFormation();
    formation.forEach((plyInfo, index) => {
      if (index > 0) {
        html += ', ';
      }
      html += getPlayerLink(plyInfo.player, compFilter);
    });
    html += ')';

    if (!match.isStandardStartTime()) {
      html += ` om ${match.date.format('HHumm')}`;
    }

    html += '<br>';
  });

  return html;
}

function getFullUrl(pathname) {
  return 'http://ttc-erembodegem.be' + pathname;
}

function getLink(url, label) {
  return `<a href="${url}">${label}</a>`;
}


function getPlayerLink(player, compFilter) {
  const label = `${player.alias} <small>${player.getCompetition(compFilter).ranking}</small>`;
  return getLink(getFullUrl('/speler/' + encodeURI(player.slug)), label);
}

function getOpponentLink(match) {
  const url = getFullUrl(`/tegenstander/${match.competition}/${match.opponent.clubId}/${match.opponent.teamCode}`);
  const divisionRanking = match.getTeam().getDivisionRanking(match.opponent);
  const label = `${match.renderOpponentTitle()}`;
  return `<small>#${divisionRanking.position}</small> ` + getLink(url, label);
}

function getTeamLink(match) {
  const url = getFullUrl(`/ploegen/${match.competition}/${match.getTeam().teamCode}`);
  const divisionRanking = match.getTeam().getDivisionRanking('our-ranking');
  return `<small>#${divisionRanking.position}</small> ` + getLink(url, `${match.competition} ${match.getTeam().teamCode}`);
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const endearments = [
  'Sporstars',
  'Sportars',
  'Sportaners',
  'Spartas',
  'Sportanezen',
  'Sportas',
  'undefined', // oh noes, off by one!
  '🐺, 🐯, 🐅, 🐘, 🐻, 🐉 en 🦖',
];

function getEndearment(compFilter) {
  if (compFilter === 'Vttl') {
    return 'Besten,';
  }

  let endearment = getRandom(endearments);
  return 'Beste ' + endearment + ',';
}

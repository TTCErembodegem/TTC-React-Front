import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';


const unique = (value, index, self) => self.indexOf(value) === index;

export function getMatchPlayerRankings(match, homeTeam) {
  var opponentFormation;
  if (homeTeam) {
    opponentFormation = match.players.filter(m => m.home);
  } else {
    opponentFormation = match.players.filter(m => !m.home);
  }
  const rankings = opponentFormation.map(ply => ply.ranking);
  const diffs = rankings.toArray().filter(unique);
  return diffs.map(ranking => {
    return {
      ranking,
      amount: rankings.reduce((prev, cur) => prev + (cur === ranking ? 1 : 0), 0)
    };
  });
}


export class MatchPlayerRankings extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    homeTeam: PropTypes.bool.isRequired,
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const formation = getMatchPlayerRankings(this.props.match, this.props.homeTeam);
    return (
      <span>
        {formation.map(({ranking, amount}, index) => {
          return (
            <span key={ranking}>
              {amount > 1 ? <small>{amount}x</small> : null}
              {ranking}
              {index < formation.length - 1 ? ', ' : null}
            </span>
          );
        })}
      </span>
    );
  }
}

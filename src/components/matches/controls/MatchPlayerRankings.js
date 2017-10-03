import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';


const unique = (value, index, self) => self.indexOf(value) === index;


export class MatchPlayerRankings extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    homeTeam: PropTypes.bool.isRequired,
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    var opponentFormation;
    if (this.props.homeTeam) {
      opponentFormation = this.props.match.players.filter(m => m.home);
    } else {
      opponentFormation = this.props.match.players.filter(m => !m.home);
    }

    const rankings = opponentFormation.map(ply => ply.ranking);
    const diffs = rankings.toArray().filter(unique);
    return (
      <span>
        {diffs.map((ranking, index) => {
          const cnt = rankings.reduce((prev, cur) => prev + (cur === ranking ? 1 : 0), 0);
          return (
            <span key={ranking}>
              {cnt > 1 ? <small>{cnt}x</small> : null}
              {ranking}
              {index < diffs.length - 1 ? ', ' : null}
            </span>
          );
        })}
      </span>
    );
  }
}

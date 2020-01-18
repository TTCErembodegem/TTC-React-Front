import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import {getMatchPlayerRankings} from '../../../storeUtil';


export class PlayerRankings extends Component {
  static propTypes = {
    formation: PropTypes.array.isRequired,
  }

  render() {
    const {formation, ...props} = this.props;

    return (
      <span {...props}>
        {formation.map(({ranking, amount}, index) => (
          <span key={ranking}>
            {amount > 1 ? <small>{amount}x</small> : null}
            {ranking}
            {index < formation.length - 1 ? ', ' : null}
          </span>
        ))}
      </span>
    );
  }
}


export class MatchPlayerRankings extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    homeTeam: PropTypes.bool.isRequired,
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const formation = getMatchPlayerRankings(this.props.match, this.props.homeTeam);
    return <PlayerRankings formation={formation} />;
  }
}

import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';

// import {BackIcon} from '../../controls.js';
import {TeamRankingBadges} from './TeamRankingBadges.js';
import {TeamPosition} from './TeamPosition.js';


export class DivisionHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
    withVictoryBadges: PropTypes.bool,
  }

  static defaultProps = {
    withVictoryBadges: true,
  }

  render() {
    const {team, opponent, withVictoryBadges} = this.props;
    return (
      <small>
        <TeamPosition team={team} opponent={opponent} />
        {team.getDivisionDescription()}
        {withVictoryBadges ? <TeamRankingBadges team={team} opponent={opponent} style={{/*reset fontSize*/}} /> : null}
      </small>
    );
  }
}

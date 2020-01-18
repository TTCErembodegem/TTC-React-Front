import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import {TeamRankingBadges} from './TeamRankingBadges.js';
import {TeamPosition} from './TeamPosition.js';

export class TeamTabTitle extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    showRanking: PropTypes.bool.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  render() {
    const {team, opponent, showRanking} = this.props;
    return (
      <div>
        <TeamPosition team={team} opponent={opponent} />
        {team.renderOwnTeamTitle()}
        {showRanking ? (
          <div style={{marginRight: 0}} className="pull-right">
            <TeamRankingBadges team={team} opponent={opponent} />
          </div>
        ) : null}
      </div>
    );
  }
}

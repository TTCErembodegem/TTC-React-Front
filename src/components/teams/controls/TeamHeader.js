import React from 'react';
import PropTypes from '../../PropTypes.js';
import {TeamRankingBadges} from './TeamRankingBadges.js';

export const TeamHeader = ({team, t, showRanking}) => (
  <div>
    <h4 style={{marginLeft: 5}}>
      {team.getDivisionDescription()}
      {showRanking ? <TeamRankingBadges team={team} t={t} /> : null}
    </h4>
  </div>
);

TeamHeader.propTypes = {
  team: PropTypes.TeamModel.isRequired,
  t: PropTypes.func.isRequired,
  showRanking: PropTypes.bool.isRequired,
};

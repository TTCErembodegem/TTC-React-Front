import React from 'react';
import PropTypes from '../../PropTypes';
import {TeamRankingBadges} from './TeamRankingBadges';

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

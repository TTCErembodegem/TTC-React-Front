import React from 'react';
import PropTypes from '../../PropTypes';
import MatchVs from './MatchVs';

export const TheirTeamTitle = ({match, ...props}) => (
  <span className="match-opponent-team">
    <MatchVs match={match} themOnly {...props} />
  </span>
);

TheirTeamTitle.propTypes = {
  match: PropTypes.MatchModel.isRequired,
};

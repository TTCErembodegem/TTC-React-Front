import React from 'react';
import PropTypes from '../../PropTypes.js';
import MatchVs from './MatchVs.js';

export const TheirTeamTitle = ({match, ...props}) => {
  return (
    <span className="match-opponent-team">
      <MatchVs match={match} themOnly={true} {...props} />
    </span>
  );
};

TheirTeamTitle.propTypes = {
  match: PropTypes.MatchModel.isRequired,
};

import React from 'react';
import PropTypes from '../../PropTypes.js';
import {OpponentLink} from '../../teams/controls/OpponentLink.js';

export const OtherMatchTeamTitle = ({team, readonlyMatch, isHome, withPosition}) => {
  const opponent = isHome ? readonlyMatch.home : readonlyMatch.away;
  return <OpponentLink team={team} opponent={opponent} withPosition={withPosition} />;
};

OtherMatchTeamTitle.propTypes = {
  team: PropTypes.TeamModel.isRequired,
  readonlyMatch: PropTypes.MatchModel.isRequired,
  isHome: PropTypes.bool.isRequired,
  withPosition: PropTypes.bool.isRequired,
};

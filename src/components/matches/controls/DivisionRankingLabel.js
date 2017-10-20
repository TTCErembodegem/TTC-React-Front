import React from 'react';
import PropTypes from '../../PropTypes.js';

export const DivisionRankingLabel = ({divisionRanking}) => {
  if (!divisionRanking || !divisionRanking.position) {
    return null;
  }

  return <small className="match-opponent-team">{divisionRanking.position}. </small>;
};

DivisionRankingLabel.propTypes = {
  divisionRanking: PropTypes.shape({
    position: PropTypes.number,
  }),
};



export const OurDivisionRankingLabel = ({team}) => {
  const divisionRanking = team.getDivisionRanking('our-ranking');
  if (!divisionRanking || !divisionRanking.position) {
    return null;
  }

  return <small style={{marginRight: 6}}>{divisionRanking.position}.</small>;
};

OurDivisionRankingLabel.propTypes = {
  team: PropTypes.TeamModel.isRequired,
};

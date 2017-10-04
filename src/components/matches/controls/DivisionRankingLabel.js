import React from 'react';


export const DivisionRankingLabel = ({divisionRanking}) => {
  if (!divisionRanking) {
    return null;
  }

  return <small className="match-opponent-team">{divisionRanking.position}. </small>;
};


export const OurDivisionRankingLabel = ({team}) => {
  const divisionRanking = team.getDivisionRanking('our-ranking');
  if (!divisionRanking) {
    return null;
  }

  return <small style={{marginRight: 6}}>{divisionRanking.position}.</small>;
};

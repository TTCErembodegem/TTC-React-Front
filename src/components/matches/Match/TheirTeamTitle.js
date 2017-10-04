import React, {Component} from 'react';
import MatchVs from './MatchVs.js';


export const TheirTeamTitle = ({match}) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking(match.opponent);
  return (
    <span className="match-opponent-team">
      <MatchVs match={match} themOnly={true} />
    </span>
  );
};

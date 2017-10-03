import React, {Component} from 'react';

export const OtherMatchTeamTitle = ({team, readonlyMatch, isHome}) => {
  const divisionRanking = team.getDivisionRanking(isHome ? readonlyMatch.home : readonlyMatch.away);

  var teamTitle;
  if (isHome) {
    teamTitle = readonlyMatch.getClub('home').name + ' ' + readonlyMatch.home.teamCode;
  } else {
    teamTitle = readonlyMatch.getClub('away').name + ' ' + readonlyMatch.away.teamCode;
  }

  return (
    <span>
      <small className="match-opponent-team">{divisionRanking.position ? divisionRanking.position + '. ' : ''}</small>
      {teamTitle}
    </span>
  );
};

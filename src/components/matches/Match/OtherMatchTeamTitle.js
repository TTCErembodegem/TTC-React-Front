import React from 'react';
import PropTypes from '../../PropTypes.js';
import {DivisionRankingLabel} from '../controls/DivisionRankingLabel.js';

export const OtherMatchTeamTitle = ({team, readonlyMatch, isHome}) => {
  const divisionRanking = team.getDivisionRanking(isHome ? readonlyMatch.home : readonlyMatch.away);

  const homeClub = readonlyMatch.getClub('home');
  const awayClub = readonlyMatch.getClub('away');

  var teamTitle = null;
  if (isHome && homeClub) {
    teamTitle = homeClub.name + ' ' + readonlyMatch.home.teamCode;

  } else if (!isHome && awayClub) {
    teamTitle = awayClub.name + ' ' + readonlyMatch.away.teamCode;
  }

  if (divisionRanking.isForfait) {
    return <s>{teamTitle}</s>;
  }

  return (
    <span>
      <DivisionRankingLabel divisionRanking={divisionRanking} />
      {teamTitle}
    </span>
  );
};

OtherMatchTeamTitle.propTypes = {
  team: PropTypes.TeamModel.isRequired,
  readonlyMatch: PropTypes.MatchModel.isRequired,
  isHome: PropTypes.bool.isRequired,
};

import React from 'react';
import { Icon } from '../../controls/Icon.js';

const MatchVs = ({match, opponentOnly, themOnly = false}) => {
  const forfait = match.getTeam().getDivisionRanking(match.opponent).isForfait;
  var them = match.renderOpponentTitle();
  if (forfait) {
    console.log(match.frenoyMatchId, match.opponent, match.getTeam().getDivisionRanking(match.opponent));
    them = <span style={{textDecoration: 'line-through'}}>{them}</span>
  }

  if (themOnly) {
    return <span>{them}</span>;
  }

  const us = <span className="label label-as-badge label-info" style={{fontSize: 14}}>{match.getTeam().renderOwnTeamTitle()}</span>;
  if (!match.shouldBePlayed) {
    return us;
  }

  if (opponentOnly) {
    return (
      <span>
        {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} /> : null}
        {them}
      </span>
    );
  }

  const separator = <Icon fa="fa fa-arrows-h" />;
  if (match.isHomeMatch) {
    return <span>{us} {separator} {them}</span>;
  }
  return <span>{them} {separator} {us}</span>;
};

export default MatchVs;
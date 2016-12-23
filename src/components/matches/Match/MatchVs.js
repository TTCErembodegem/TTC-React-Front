import React from 'react';
import { Icon } from '../../controls/Icon.js';

const MatchVs = ({match, opponentOnly}) => {
  const them = match.renderOpponentTitle();
  if (opponentOnly) {
    return (
      <span>
        {match.isHomeMatch ? <Icon fa="fa fa-home" style={{marginRight: 5}} /> : null}
        {them}
      </span>
    );
  }

  const us = <span className="label label-as-badge label-info" style={{fontSize: 14}}>{match.getTeam().renderOwnTeamTitle()}</span>;
  const separator = <Icon fa="fa fa-arrows-h" />;
  if (match.isHomeMatch) {
    return <span>{us} {separator} {them}</span>;
  }
  return <span>{them} {separator} {us}</span>;
};

export default MatchVs;
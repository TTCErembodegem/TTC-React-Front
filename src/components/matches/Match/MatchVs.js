import React from 'react';
import Icon from '../../controls/Icon.js';

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

  const us = match.getTeam().renderOwnTeamTitle();
  const separator = <Icon fa="fa fa-arrows-h" />;
  if (match.isHomeMatch) {
    return <span><strong>{us}</strong> {separator} {them}</span>;
  }
  return <span>{them} {separator} <strong>{us}</strong></span>;
}

export default MatchVs;
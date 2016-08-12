import React from 'react';
import Icon from '../../controls/Icon.js';

const MatchVs = ({match}) => {
  const us = match.getTeam().renderOwnTeamTitle();
  const them = match.renderOpponentTitle();
  const separator = <Icon fa="fa fa-arrows-h" />;
  if (match.isHomeMatch) {
    return <span><strong>{us}</strong> {separator} {them}</span>;
  }
  return <span>{them} {separator} <strong>{us}</strong></span>;
}

export default MatchVs;
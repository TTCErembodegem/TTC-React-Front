import React, {Component} from 'react';
import PropTypes, {browserHistory} from '../../PropTypes.js';
import MatchScore from '../MatchScore.js';
import cn from 'classnames';

export const ViewMatchDetailsButton = ({match, t}) => {
  if (!match.shouldBePlayed) {
    return <div />;
  }

  const score = match.renderScore();
  return (
    <a className={cn({'btn btn-default': !score, clickable: !!score})} onClick={() => browserHistory.push(t.route('match', {matchId: match.id}))}>
      {score ? <MatchScore match={match} style={{fontSize: 16}} showComments /> : t('match.details')}
    </a>
  );
}

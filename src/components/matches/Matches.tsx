import React from 'react';
import moment from 'moment';
import { Strike } from '../controls/controls/Strike';
import { SmallMatchCardHeader } from './Match/MatchCardHeader';
import { t } from '../../locales';
import { IMatch } from '../../models/model-interfaces';
import { selectMatches, useTtcSelector } from '../../utils/hooks/storeHooks';

export const Matches = () => {
  const ownMatches = useTtcSelector(selectMatches);

  const matchesToShow = 10;
  // const showFutureMatchesDays = 7;
  // const showPlayedMatchesDays = 20;

  const today = moment();

  const matchesToday = ownMatches.filter(cal => cal.date.isSame(today, 'day'));
  const matchesNext = ownMatches
    .filter(cal => cal.date.isAfter(today, 'day')) // && cal.date.diff(today, 'days') <= showFutureMatchesDays)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .slice(0, matchesToShow);
  const matchesPlayed = ownMatches
    .filter(cal => cal.date.isBefore(today, 'day')) // && cal.date.diff(today, 'days') >= -showPlayedMatchesDays)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, matchesToShow);

  return (
    <div style={{paddingLeft: 12, paddingRight: 12}}>
      {matchesToday.length ? <Strike text={t('match.todayMatches')} style={{marginTop: 15}} /> : null}
      <MatchHeaders matches={matchesToday} />
      {matchesNext.length ? <Strike text={t('match.nextMatches')} style={{marginTop: 15}} /> : null}
      <MatchHeaders matches={matchesNext} />
      {matchesPlayed.length ? <Strike text={t('match.playedMatches')} style={{marginTop: 15}} /> : null}
      <MatchHeaders matches={matchesPlayed} />
    </div>
  );
};


const MatchHeaders = ({matches}: {matches: IMatch[]}) => {
  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="row">
      {matches.map(match => (
        <div className="col-xl-4 col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
          <SmallMatchCardHeader match2={match} isOpen={false} noScoreEdit />
        </div>
      ))}
    </div>
  );
};

import React from 'react';

export const WeekTitle = ({t, weekNr, weekStart, weekEnd}) => (
  <span>
    {t('match.week')}&nbsp;
    {weekNr}
    :&nbsp;
    {weekStart.format('D/M')}
      &nbsp;-&nbsp;
    {weekEnd.format('D/M')}
  </span>
);

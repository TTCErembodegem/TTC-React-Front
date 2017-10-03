import React from 'react';
import {ViewMatchDetailsButton} from '../controls/ViewMatchDetailsButton.js';

export const OpponentMatchScore = ({readonlyMatch}) => {
  if (readonlyMatch.isOurMatch) {
    const match = readonlyMatch.getOurMatch();
    return <ViewMatchDetailsButton match={match} size="xs" />;
  }

  if (readonlyMatch.scoreType === 'WalkOver') {
    return <span>WO</span>; // TODO: translation
  }

  if (!readonlyMatch.isSyncedWithFrenoy) {
    return null;
  }

  return <span>{readonlyMatch.score.home} - {readonlyMatch.score.out}</span>;
}

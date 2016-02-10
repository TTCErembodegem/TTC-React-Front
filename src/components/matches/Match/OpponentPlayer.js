import React from 'react';

const OpponentPlayer = ({ply, t}) => (
  <div>
    {ply.name}
    <small> {ply.ranking + ' '}{ply.won ? t('match.enemyVictory', ply.won) : null}</small>
  </div>
);

export default OpponentPlayer;
import React from 'react';
import { FrenoyLink } from './OpponentsFormation.js';

const OpponentPlayer = ({ply, t, competition}) => (
  <div>
    {ply.name}
    &nbsp;&nbsp;
    {ply.ranking + ' '}
    <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex} />
    <small style={{marginLeft: 7}}> {ply.won ? t('match.enemyVictory', ply.won) : null}</small>
  </div>
);

export default OpponentPlayer;
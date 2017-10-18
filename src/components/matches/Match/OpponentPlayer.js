import React from 'react';
import PropTypes from '../../PropTypes.js';
import {FrenoyLink} from './OpponentsFormation.js';

const OpponentPlayer = ({ply, t, competition}) => (
  <div>
    {ply.name}
    &nbsp;&nbsp;
    {ply.ranking + ' '}
    <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex} />
    <small style={{marginLeft: 7}}> {ply.won ? t('match.enemyVictory', ply.won) : null}</small>
  </div>
);

OpponentPlayer.propTypes = {
  t: PropTypes.func.isRequired,
  ply: PropTypes.object.isRequired,
  competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
};


export default OpponentPlayer;

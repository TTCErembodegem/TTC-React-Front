import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';

export class OpponentPlayerLabel extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
    fullName: PropTypes.bool,
  }

  static defaultProps = {
    fullName: true,
  }

  render() {
    const {competition, player, fullName} = this.props;
    return (
      <span>
        <span style={{marginRight: 7}}>{fullName ? player.name : player.alias}</span>
        <FrenoyLink competition={competition} uniqueIndex={player.uniqueIndex}>
          {player.ranking}
          &nbsp;
        </FrenoyLink>
      </span>
    );
  }
}


const OpponentPlayer = ({ply, t, competition}) => (
  <div>
    <OpponentPlayerLabel player={ply} competition={competition} />
    <small style={{marginLeft: 7}}> {ply.won ? t('match.enemyVictory', ply.won) : null}</small>
  </div>
);

OpponentPlayer.propTypes = {
  t: PropTypes.func.isRequired,
  ply: PropTypes.object.isRequired,
  competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
};


export default OpponentPlayer;

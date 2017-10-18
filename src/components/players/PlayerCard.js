import React, {Component} from 'react';
import PropTypes, {connect, browseTo} from '../PropTypes.js';

import Panel from 'react-bootstrap/lib/Panel';
import PlayerImage from './PlayerImage.js';
import {Email, Icon, Telephone, PlayerAddress} from '../controls.js';
import {PlayerPlayingStyleForm} from './PlayerPlayingStyle.js';

@connect(state => ({user: state.user}))
export default class PlayerCard extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired,
    player: PropTypes.PlayerModel.isRequired,
  };

  render() {
    const {player} = this.props;
    const loggedIn = this.props.user.playerId;
    return (
      <Panel style={{height: loggedIn ? 440 : 300}} header={(
        <div style={{height: 40}}>
          <div style={{float: 'left'}}>
            <strong>{player.name}</strong>
            <br />
            {player.style ? player.style.name : null}
          </div>

          <div style={{textAlign: 'right', float: 'right'}}>
            <PlayerAllCompetitions player={player} t={this.context.t} />
          </div>
          <div style={{clear: 'both'}} />
        </div>
      )}>

        <PlayerPlayingStyleForm player={player} iconStyle="edit-icon" style={{color: '#d3d3d3', float: 'right'}} />

        <PlayerImage playerId={player.id} center />
        <br />
        <Email email={player.contact.email} showIcon />
        <br />
        <Telephone player={player} />
        <PlayerAddress contact={player.contact} style={{marginTop: 10}} />
      </Panel>
    );
  }
}


PlayerCard.Competition = ({player, t}) => (
  <div style={{marginTop: 5}}>
    <strong>{t('common.competition')}</strong>
    <br />
    <PlayerAllCompetitions player={player} t={t} />
  </div>
);

PlayerCard.Competition.propTypes = {
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
};



export const PlayerAllCompetitions = ({player, t}) => (
  <div>
    <PlayerCompetition comp="Vttl" player={player} t={t} />
    {player.vttl && player.sporta ? <br /> : null}
    <PlayerCompetition comp="Sporta" player={player} t={t} />
  </div>
);

PlayerAllCompetitions.propTypes = {
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
};


export const TeamCaptainIcon = ({t}) => (
  <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} title={t('player.teamCaptain')} />
);

TeamCaptainIcon.propTypes = {t: PropTypes.func.isRequired};



export const PlayerCompetition = ({comp, player, t, withName = false}) => {
  // withName = Jorn C2 (frenoylink)
  // !withName = Sporta (ploeg) C2 (frenoylink)
  const compDetails = player.getCompetition(comp);
  if (!compDetails.ranking) {
    return <div />;
  }

  const team = player.getTeam(comp);
  const isCaptain = team ? team.isCaptain(player) : false;
  return (
    <span>
      {isCaptain ? <TeamCaptainIcon t={t} /> : null}
      {withName ? (
        <strong>{player.alias}</strong>
      ) : (
        <a onClick={() => browseTo.team(team)} className="link-hover-underline">
          {comp} {team ? team.teamCode : null}
        </a>
      )}
      <small style={{marginLeft: 10}}>{compDetails.ranking} <PlayerFrenoyLink comp={compDetails} /></small>
    </span>
  );
};

PlayerCompetition.propTypes = {
  comp: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
  withName: PropTypes.bool,
};


import {createFrenoyLink} from '../../models/PlayerModel.js';
export const PlayerFrenoyLink = ({comp}) => (
  <a href={createFrenoyLink(comp)} target="_blank">
    <Icon fa="fa fa-search" />
  </a>
);

PlayerFrenoyLink.propTypes = {comp: PropTypes.object.isRequired};

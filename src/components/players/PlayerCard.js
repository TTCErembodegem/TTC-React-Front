import React, {Component} from 'react';
import PropTypes, {connect, browseTo, withViewport} from '../PropTypes.js';
import {Link} from 'react-router-dom';

import Panel from 'react-bootstrap/lib/Panel';
import PlayerImage from './PlayerImage.js';
import {Icon, FrenoyPlayerDetailsIcon, PlayerLink} from '../controls.js';
import {PlayerPlayingStyleForm} from './PlayerPlayingStyle.js';
import {PlayerContact} from './controls/PlayerContact.js';

@withViewport
@connect(state => ({user: state.user}))
export default class PlayerCard extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    user: PropTypes.UserModel.isRequired,
    player: PropTypes.PlayerModel.isRequired,
    showSideBySide: PropTypes.bool,
  }
  static defaultProps = {
    showSideBySide: false,
  }

  render() {
    const {player, showSideBySide} = this.props;
    const showAddressBelow = !showSideBySide;
    return (
      <Panel style={{height: this.props.user.playerId && showAddressBelow ? 410 : 300, marginBottom: 20}}>
        <Panel.Heading>
          <div style={{height: 40}}>
            <div style={{float: 'left'}}>
              <strong><PlayerLink player={player} /></strong>
              <br />
              {player.style ? player.style.name : null}
            </div>

            <div style={{textAlign: 'right', float: 'right'}}>
              <PlayerAllCompetitions player={player} t={this.context.t} />
            </div>
            <div style={{clear: 'both'}} />
          </div>
        </Panel.Heading>

        <PlayerPlayingStyleForm player={player} iconStyle="edit-icon" style={{color: '#d3d3d3', position: 'absolute', top: 75, right: 27}} />

        <Panel.Body>
          {!this.props.user.playerId || showAddressBelow ? (
            <div>
              <PlayerImage playerId={player.id} center shape="thumbnail" />
              <br />
              <PlayerContact player={player} />
            </div>
          ) : (
            <div className="media" style={{marginTop: 0}}>
              <div className="media-left">
                <PlayerImage playerId={player.id} shape="thumbnail" className="pull-left" style={{width: 200}} />
              </div>
              <div className="media-body">
                <PlayerContact player={player} />
              </div>
            </div>
          )}
        </Panel.Body>
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
    <PlayerCompetitionLabel comp="Vttl" player={player} t={t} />
    {player.vttl && player.sporta ? <br /> : null}
    <PlayerCompetitionLabel comp="Sporta" player={player} t={t} />
  </div>
);

PlayerAllCompetitions.propTypes = {
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
};


export const TeamCaptainIcon = ({t}) => (
  <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} tooltip={t('player.teamCaptain')} />
);

TeamCaptainIcon.propTypes = {t: PropTypes.func.isRequired};



export const PlayerCompetitionLabel = ({comp, player, t, withName = false}) => {
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
        <strong><PlayerLink player={player} alias={withName === 'alias'} /></strong>
      ) : (
        <Link to={browseTo.getTeam(team || {competition: comp})} className="link-hover-underline">
          {comp}{team ? ' ' + team.teamCode : null}
        </Link>
      )}
      <PlayerFrenoyLink comp={compDetails} style={{marginLeft: 10}}>
        {compDetails.ranking}
      </PlayerFrenoyLink>
    </span>
  );
};

PlayerCompetitionLabel.propTypes = {
  comp: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
  withName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['alias']),
  ]),
};


import {createFrenoyLink} from '../../models/PlayerModel.js';
export const PlayerFrenoyLink = ({comp, style, children}) => (
  <a href={createFrenoyLink(comp)} target="_blank" className="link-hover-underline" style={style}>
    {children} <FrenoyPlayerDetailsIcon />
  </a>
);

PlayerFrenoyLink.propTypes = {
  comp: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
};

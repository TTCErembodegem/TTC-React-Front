import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Panel from 'react-bootstrap/lib/Panel';
import PropTypes, {connect, browseTo, withViewport} from '../PropTypes';
import PlayerImage from './PlayerImage';
import {PlayerPlayingStyleForm} from './PlayerPlayingStyle';
import {PlayerContact} from './controls/PlayerContact';
import {createFrenoyLink} from '../../models/PlayerModel';
import {PlayerLink} from './controls/PlayerLink';
import {Icon} from '../controls/Icons/Icon';
import {FrenoyPlayerDetailsIcon} from '../controls/Buttons/FrenoyButton';
import {Viewport, IPlayer, Translator, IPlayerCompetition, Competition} from '../../models/model-interfaces';
import {IUser} from '../../models/UserModel';

type PlayerCardProps = {
  viewport: Viewport;
  user: IUser;
  player: IPlayer;
  showSideBySide?: boolean;
}

class PlayerCard extends Component<PlayerCardProps> {
  static contextTypes = PropTypes.contextTypes;

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


type PlayerCardCompetitionProps = {
  player: IPlayer;
  t: Translator;
}

PlayerCard.Competition = ({player, t}: PlayerCardCompetitionProps) => (
  <div style={{marginTop: 5}}>
    <strong>{t('common.competition')}</strong>
    <br />
    <PlayerAllCompetitions player={player} t={t} />
  </div>
);


type PlayerAllCompetitionsProps = {
  player: IPlayer;
  t: Translator;
};

export const PlayerAllCompetitions = ({player, t}: PlayerAllCompetitionsProps) => (
  <div>
    <PlayerCompetitionLabel comp="Vttl" player={player} t={t} />
    {player.vttl && player.sporta ? <br /> : null}
    <PlayerCompetitionLabel comp="Sporta" player={player} t={t} />
  </div>
);



export const TeamCaptainIcon = ({t}: {t: Translator}) => (
  <Icon fa="fa fa-star" color="#FFB00F" style={{marginRight: 5}} tooltip={t('player.teamCaptain')} />
);



type PlayerCompetitionLabelProps = {
  comp: Competition;
  player: IPlayer;
  t: Translator;
  withName: boolean | 'alias';
};


export const PlayerCompetitionLabel = ({comp, player, t, withName = false}: PlayerCompetitionLabelProps) => {
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
          {comp}{team ? ` ${team.teamCode}` : null}
        </Link>
      )}
      <PlayerFrenoyLink comp={compDetails} style={{marginLeft: 10}}>
        {compDetails.ranking}
      </PlayerFrenoyLink>
    </span>
  );
};


type PlayerFrenoyLinkProps = {
  comp: IPlayerCompetition;
  style?: React.CSSProperties;
  children?: any;
};

export const PlayerFrenoyLink = ({comp, style, children}: PlayerFrenoyLinkProps) => (
  <a href={createFrenoyLink(comp)} target="_blank" className="link-hover-underline" style={style} rel="noopener noreferrer">
    {children} <FrenoyPlayerDetailsIcon />
  </a>
);

export default withViewport(connect(state => ({user: state.user}))(PlayerCard));

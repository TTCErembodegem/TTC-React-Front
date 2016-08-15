import React, { Component } from 'react';
import PropTypes, { connect, withViewport } from '../../PropTypes.js';

import { OwnClubId } from '../../../models/ClubModel.js';
import * as matchActions from '../../../actions/matchActions.js';
import { setSetting } from '../../../actions/configActions.js';
import { util as storeUtils } from '../../../store.js';

import TabbedContainer from '../../controls/TabbedContainer.js';
import Spinner from '../../controls/Spinner.js';
import Icon from '../../controls/Icon.js';
import { CardText } from 'material-ui/Card';

import MatchCardHeader, { BigMatchCardHeader } from './MatchCardHeader.js';
import MatchPlayerResults from './MatchPlayerResults.js';
import IndividualMatches from './IndividualMatches.js';
import OpponentClubLocations from './OpponentClubLocations.js';
import SelectPlayersForm from './SelectPlayersForm.js';
import OpponentsLastMatches from './OpponentsLastMatches.js';
import OpponentsFormation from './OpponentsFormation.js';
import MatchReport from './MatchReport.js';
import Scoresheet from './Scoresheet.js';
import PlayersImageGallery from '../../players/PlayersImageGallery.js';

const tabEventKeys = {
  players: 1,
  individualMatches: 2,
  report: 3,
  opponentClub: 4,
  scoresheet: 5,
  opponentsRanking: 6,
  opponentsFormation: 7,
  admin: 8,
};

@withViewport
@connect(state => {
  return {
    config: state.config,
    user: state.user,
    readonlyMatches: state.readonlyMatches,
  };
}, Object.assign({}, matchActions, {setSetting}))
export default class MatchCard extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    readonlyMatches: PropTypes.object.isRequired,
    viewport: PropTypes.viewport,

    match: PropTypes.MatchModel.isRequired,

    viewportWidthContainerCount: PropTypes.number.isRequired,
    big: PropTypes.bool,
    small: PropTypes.bool,
    isOpen: PropTypes.bool,

    getLastOpponentMatches: PropTypes.func.isRequired,
    setSetting: PropTypes.func.isRequired,
  }
  static defaultProps = {
    viewportWidthContainerCount: 1 // The amount of containers next to eachother that display a PlayersImageGallery
  }

  constructor(props) {
    if (props.small) { // TODO: remove this if small prop is never passed (doesn't seem to be the case...)
      console.error('passed props.small to MatchCard');
    }
    super(props);
    this.state = {
      forceEditPlayers: false
    };
  }

  componentDidMount() {
    this.props.getLastOpponentMatches(this.props.match.teamId, this.props.match.opponent);
  }

  render() {
    var match = this.props.match;
    const HeaderComponent = this.props.big ? BigMatchCardHeader : MatchCardHeader;

    const tabConfig = [{
      key: tabEventKeys.players,
      title: this.context.t('match.tabs.playersTitle'),
      label: this.context.t('match.tabs.players'),
      headerChildren: this._getPlayersEditIcon(),
    }, {
      key: tabEventKeys.report,
      title: this.context.t('match.tabs.reportTitle'),
      label: this.context.t('match.tabs.report'),
      headerChildren: this._getCommentsIcon(),
    }, {
      key: tabEventKeys.individualMatches,
      title: this.context.t('match.tabs.matchesTitle'),
      label: this.context.t('match.tabs.matches'),
      show: match.games.size !== 0,
    }, {
      key: tabEventKeys.scoresheet,
      title: this.context.t('match.tabs.scoresheet'),
      show: match.scoreType === 'BeingPlayed' && !!match.players.size,
    }, {
      key: tabEventKeys.opponentClub,
      title: this.context.t('match.tabs.clubTitle'),
      label: this.context.t('match.tabs.club'),
      show: !match.isHomeMatch && !match.isPlayed,
    }, {
      key: tabEventKeys.opponentsRanking,
      title: this.context.t('match.tabs.opponentsRankingTitle'),
      label: this.context.t('match.tabs.opponentsRanking'),
    }, {
      key: tabEventKeys.opponentsFormation,
      title: this.context.t('match.tabs.opponentsFormationTitle'),
      label: this.context.t('common.teamFormation'),
    }, {
      key: tabEventKeys.admin,
      title: 'admin',
      label: 'admin',
      show: this.props.user.isDev(),
    }];

    return (
      <HeaderComponent {...this.props} backgroundColor="#fafafa" isOpen={this.props.isOpen} style={{margin: 50}} config={this.props.config}>
        <CardText expandable={true} style={{paddingTop: 0, paddingLeft: 5, paddingRight: 5}}>
          <TabbedContainer
            openTabKey={tabEventKeys.players}
            tabKeys={tabConfig}
            tabRenderer={::this._renderTabContent}
            onTabSelect={::this._onTabSelect} />
        </CardText>
      </HeaderComponent>
    );
  }
  _getCommentsIcon() {
    const hasNewComment = this.props.config.get('newMatchComment' + this.props.match.id);
    if (!hasNewComment) {
      return;
    }
    return <Icon fa="fa fa-comment-o" className="match-card-tab-icon" />;
  }
  _getPlayersEditIcon() {
    const match = this.props.match;
    const isAllowedToEdit = this.props.user.canManageTeam(match.teamId);
    return isAllowedToEdit && !match.isSyncedWithFrenoy ? (
      <Icon fa="fa fa-pencil-square-o" onClick={::this._onStartEditPlayers} className="match-card-tab-icon" />) : null;
  }
  _onStartEditPlayers() {
    this.setState({forceEditPlayers: !this.state.forceEditPlayers});
  }
  _onTabSelect(eventKey) {
    if (eventKey === tabEventKeys.report) {
      this.props.setSetting('newMatchComment' + this.props.match.id, false);
    }
  }
  _renderTabContent(eventKey) {
    switch (eventKey) {
    case tabEventKeys.players:
      return this._renderPlayers();

    case tabEventKeys.individualMatches:
      return <IndividualMatches match={this.props.match} ownPlayerId={this.props.user.playerId} t={this.context.t} />;

    case tabEventKeys.report:
      return <MatchReport match={this.props.match} t={this.context.t} user={this.props.user} viewport={this.props.viewport} />;

    case tabEventKeys.opponentClub:
      return <OpponentClubLocations club={this.props.match.getOpponentClub()} t={this.context.t} />;

    case tabEventKeys.scoresheet:
      return <Scoresheet match={this.props.match} t={this.context.t} viewport={this.props.viewport} />;

    case tabEventKeys.opponentsRanking:
      return this._renderOpponentsRanking();

    case tabEventKeys.opponentsFormation:
      return this._renderOpponentFormation();

    case tabEventKeys.admin:
      return (
        <div>
          ID={this.props.match.id}<br />FrenoyId={this.props.match.frenoyMatchId}
          <pre>
            {JSON.stringify(this.props.match, null, 4)}
          </pre>
        </div>
      );
    }
    return 'Unknown';
  }

  _renderOpponentsRanking() {
    const matches = storeUtils.matches
      .getFromOpponent(this.props.match)
      .filter(match => match.id !== this.props.match.id);

    const theirOtherMatches = matches
      .filter(match => match.score && (match.score.home || match.score.out))
      .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1);

    // TODO: findFirstRoundMatch: move this to team model or something
    const firstRoundMatch = matches.find(match => (
        (match.home.clubId === OwnClubId && match.home.teamCode === this.props.match.getTeam().teamCode) ||
        (match.away.clubId === OwnClubId && match.away.teamCode === this.props.match.getTeam().teamCode)
      ));

    const firstRoundRealMatch = firstRoundMatch ? storeUtils.getMatch(firstRoundMatch.id) : null;
    return <OpponentsLastMatches match={this.props.match} readonlyMatches={theirOtherMatches} otherMatch={firstRoundRealMatch} />;
  }
  _renderOpponentFormation() {
    const formations = storeUtils.matches
      .getFormation(this.props.match)
      .sort((a, b) => a.count < b.count ? 1 : -1);

    if (formations.length === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return <OpponentsFormation formations={formations} competition={this.props.match.competition} />;
  }

  _renderPlayers() {
    const match = this.props.match;
    const team = match.getTeam();

    if (match.isSyncedWithFrenoy) {
      return <MatchPlayerResults match={match} team={match.getTeam()} t={this.context.t} />;
    }

    const playingPlayers = match.players.filter(ply => ply.status === 'Play');
    if (this.state.forceEditPlayers || (this.props.user.canManageTeam(match.teamId) && playingPlayers.size < team.getTeamPlayerCount())) {
      return <SelectPlayersForm match={match} user={this.props.user} />;
    }

    if (match.players.size === 0) {
      const standardPlayers = team.getPlayers('standard').map(ply => ply.player);
      return (
        <PlayersImageGallery
          players={standardPlayers}
          user={this.props.user}
          competition={team.competition}
          viewport={this.props.viewport}
          viewportWidthContainerCount={this.props.viewportWidthContainerCount} />
      );
    }

    return (
      <PlayersImageGallery
        players={match.getOwnPlayerModels()}
        user={this.props.user}
        competition={team.competition}
        viewport={this.props.viewport}
        viewportWidthContainerCount={this.props.viewportWidthContainerCount} />
    );
  }
}
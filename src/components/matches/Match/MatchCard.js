import React, {Component} from 'react';
import PropTypes, {connect, withViewport, keyMirror, storeUtil} from '../../PropTypes.js';

import * as matchActions from '../../../actions/matchActions.js';
import {setSetting} from '../../../actions/configActions.js';

import {TabbedContainer, CommentIcon, EditIcon} from '../../controls.js';
import {CardText} from '@material-ui/core/Card';

import MatchCardHeader, {BigMatchCardHeader} from './MatchCardHeader.js';
import MatchPlayerResults from './MatchPlayerResults.js';
import IndividualMatches from './IndividualMatches.js';
import OpponentClubLocations from './OpponentClubLocations.js';
import SelectPlayersForm from './SelectPlayersForm.js';
import OpponentsLastMatches from './OpponentsLastMatches.js';
import OpponentsFormation from './OpponentsFormation.js';
import MatchReport from './MatchReport.js';
import Scoresheet from './Scoresheet.js';
import PlayersImageGallery from '../../players/PlayersImageGallery.js';
import {MatchOtherRoundButton} from '../controls/ViewMatchDetailsButton.js';
import {MatchCardAdmin} from './MatchCardAdmin.js';

const tabEventKeys = keyMirror({
  players: '',
  individualMatches: '',
  report: '',
  opponentClub: '',
  scoresheet: '',
  opponentsRanking: '',
  opponentsFormation: '',
  admin: '',
});

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
    getOpponentMatches: PropTypes.func.isRequired,
    setSetting: PropTypes.func.isRequired,

    match: PropTypes.MatchModel.isRequired,
    viewportWidthContainerCount: PropTypes.number.isRequired,
    big: PropTypes.bool,
    small: PropTypes.bool,
    isOpen: PropTypes.bool,

    params: PropTypes.shape({
      tabKey: PropTypes.string
    }),
  }
  static defaultProps = {
    viewportWidthContainerCount: 1 // The amount of containers next to eachother that display a PlayersImageGallery
  }

  constructor(props) {
    if (props.small) { // TODO: remove this if small prop is never passed (doesn't seem to be the case...)
      console.error('passed props.small to MatchCard'); // eslint-disable-line
    }
    super(props);
    this.state = {
      forceEditPlayers: false
    };
  }

  componentDidMount() {
    this.props.getOpponentMatches(this.props.match.teamId);
  }

  render() {
    const match = this.props.match;
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
      show: match.isBeingPlayed() && !!match.players.size,
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
      <HeaderComponent
        {...this.props}
        backgroundColor="#fafafa"
        isOpen={this.props.isOpen}
        style={{margin: 50}}
        config={this.props.config}
        forceEdit={this.state.forceEditPlayers}
      >
        <CardText expandable={true} style={{paddingTop: 0, paddingLeft: 5, paddingRight: 5}}>
          <TabbedContainer
            params={this.props.params}
            style={{marginBottom: -18}}
            defaultTabKey={tabEventKeys.players}
            tabKeys={tabConfig}
            tabRenderer={::this._renderTabContent}
            onTabSelect={::this._onTabSelect}
            route={{base: this.context.t.route('match').replace(':matchId', match.id), subs: 'matchTabs'}}
          />
        </CardText>
      </HeaderComponent>
    );
  }
  _getCommentsIcon() {
    const hasNewComment = this.props.config.get('newMatchComment' + this.props.match.id);
    if (!hasNewComment) {
      return;
    }
    return <CommentIcon className="match-card-tab-icon" />;
  }
  _getPlayersEditIcon() {
    const match = this.props.match;
    const isAllowedToEdit = this.props.user.canEditPlayersOnMatchDay(match);
    return isAllowedToEdit && !match.isSyncedWithFrenoy ? <EditIcon onClick={::this._onStartEditPlayers} className="match-card-tab-icon" /> : null;
  }
  _onStartEditPlayers(event) {
    event.stopPropagation();
    event.preventDefault();
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
      return <IndividualMatches match={this.props.match} />;

    case tabEventKeys.report:
      return <MatchReport match={this.props.match} t={this.context.t} user={this.props.user} viewport={this.props.viewport} />;

    case tabEventKeys.opponentClub:
      return <OpponentClubLocations club={this.props.match.getOpponentClub()} t={this.context.t} />;

    case tabEventKeys.scoresheet:
      return <Scoresheet match={this.props.match} t={this.context.t} viewport={this.props.viewport} />;

    case tabEventKeys.opponentsRanking:
      return this._renderOpponentsRanking();

    case tabEventKeys.opponentsFormation:
      return <OpponentsFormation match={this.props.match} opponent={this.props.match.opponent} />;

    case tabEventKeys.admin:
      return <MatchCardAdmin match={this.props.match} />;
    }
    return 'Unknown';
  }

  _renderOpponentsRanking() {
    const matches = storeUtil.matches
      .getFromOpponent(this.props.match)
      .filter(match => match.id !== this.props.match.id);

    const theirOtherMatches = matches
      .filter(match => match.score && (match.score.home || match.score.out))
      .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1);

    return (
      <div>
        <MatchOtherRoundButton match={this.props.match} />
        <OpponentsLastMatches opponent={this.props.match.opponent} readonlyMatches={theirOtherMatches} />
      </div>
    );
  }

  _renderPlayers() {
    const match = this.props.match;
    const team = match.getTeam();

    if (match.isSyncedWithFrenoy) {
      return <MatchPlayerResults match={match} t={this.context.t} />;
    }

    const playingPlayers = match.getPlayerFormation('onlyFinal').map(x => x.player);
    if (this.state.forceEditPlayers || (this.props.user.canEditPlayersOnMatchDay(match) && playingPlayers.size < team.getTeamPlayerCount())) {
      return <SelectPlayersForm match={match} user={this.props.user} />;
    }

    if (playingPlayers.size === 0) {
      const standardPlayers = team.getPlayers('standard').map(ply => ply.player);
      return (
        <PlayersImageGallery
          players={standardPlayers}
          competition={team.competition}
          viewportWidthContainerCount={this.props.viewportWidthContainerCount}
        />
      );
    }

    return (
      <PlayersImageGallery
        players={playingPlayers}
        competition={team.competition}
        viewportWidthContainerCount={this.props.viewportWidthContainerCount}
      />
    );
  }
}

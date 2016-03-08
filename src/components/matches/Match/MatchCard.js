import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import moment from 'moment';

import UserModel from '../../../models/UserModel.js';
import MatchModel from '../../../models/MatchModel.js';
import * as matchActions from '../../../actions/matchActions.js';
import { util as storeUtils } from '../../../store.js';

import MatchCardHeader from './MatchCardHeader.js';
import MatchPlayerResults from './MatchPlayerResults.js';
import IndividualMatches from './IndividualMatches.js';
import OpponentClubLocations from './OpponentClubLocations.js';
import SelectPlayersForm from './SelectPlayersForm.js';
import OpponentsLastMatches from './OpponentsLastMatches.js';
import OpponentsFormation from './OpponentsFormation.js';
import MatchReport from './MatchReport.js';
import Scoresheet from './Scoresheet.js';

import Icon from '../../controls/Icon.js';
import Telephone from '../../controls/Telephone.js';

import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';

const tabEventKeys = {
  players: 1,
  individualMatches: 2,
  report: 3,
  opponentClub: 4,
  scoresheet: 5,
  opponentsRanking: 6,
  opponentsFormation: 7,
};

@connect(state => {
  return {
    matches: state.matches,
  };
})
export class RoutedMatch extends Component {
  static propTypes = {
    params: PropTypes.shape({
      matchId: PropTypes.string.isRequired
    })
  }

  _setMatchId(props) {
    var matchId = parseInt(props.params.matchId, 10);
    this.state = {
      match: storeUtils.getMatch(matchId)
    };
  }

  componentWillReceiveProps(props) {
    this._setMatchId(props);
  }


  constructor(props) {
    super(props);
    this._setMatchId(props);
  }

  render() {
    return <MatchCard match={this.state.match} />;
  }
}

@connect(state => {
  return {
    //config: state.config,
    user: state.user,
    // players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    // teams: state.teams,
  };
}, matchActions)
export default class MatchCard extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
    getLastOpponentMatches: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      openTabKey: tabEventKeys.players,
      forceEditPlayers: false
    };
  }

  componentDidMount() {
    // TODO: here check for matches using storeUtils - http request only if matches not yet present in state...
    this.props.getLastOpponentMatches(this.props.match.teamId, this.props.match.opponent);
  }

  render() {
    var match = this.props.match;
    var showIndividualMatches = match.games.size !== 0;
    return (
      <MatchCardHeader {...this.props} backgroundColor="#fafafa" isOpen={true}>
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            {this._renderNavItem(tabEventKeys.players, 'players', this._getPlayersEditIcon())}
            {showIndividualMatches ? this._renderNavItem(tabEventKeys.individualMatches, 'matches') : null}
            {!match.isHomeMatch ? this._renderNavItem(tabEventKeys.opponentClub, 'club') : null}
            {match.scoreType === 'BeingPlayed' ? this._renderNavItem(tabEventKeys.scoresheet, 'scoresheet') : null}
            {!match.isPlayed ? this._renderNavItem(tabEventKeys.opponentsRanking, 'opponentsRanking') : null}
            {!match.isPlayed ? this._renderNavItem(tabEventKeys.opponentsFormation, 'opponentsFormation') : null}
            {this._renderNavItem(tabEventKeys.report, 'report')}
            {this.props.user.isAdmin() ? this._renderNavItem('admin', 'admin') : null}
          </Nav>
          <div className="match-card-tab">
            {this._renderTabContent()}
          </div>
        </CardText>
      </MatchCardHeader>
    );
  }
  _getPlayersEditIcon() {
    var match = this.props.match;
    var team = match.getTeam();
    var playerSelectionComplete = match.players.size === team.getTeamPlayerCount();
    var isAllowedToEdit = this.props.user.canManageTeam(this.props.match.teamId);
    // TODO: stop allowEdit when frenoySync=true
    return isAllowedToEdit ? (
      <Icon fa="fa fa-pencil-square-o" onClick={::this._onStartEditPlayers} className="match-card-tab-icon" />) : null;
  }
  _onStartEditPlayers() {
    this.setState({forceEditPlayers: !this.state.forceEditPlayers});
  }
  _renderNavItem(eventKey, tKey, children = null) {
    return (
      <NavItem eventKey={eventKey} title={this.context.t(`match.tabs.${tKey}Title`)}>
        {this.context.t(`match.tabs.${tKey}`)} {children}
      </NavItem>
    );
  }
  _onTabSelect(eventKey) {
    this.setState({openTabKey: eventKey});
  }
  _renderTabContent() {
    switch (this.state.openTabKey) {
    case tabEventKeys.players:
      return this._renderPlayers();
    case tabEventKeys.individualMatches:
      return this._renderIndividualMatches();
    case tabEventKeys.report:
      return this._renderReport();
    case tabEventKeys.opponentClub:
      return this._renderOpponentClub();
    case tabEventKeys.scoresheet:
      return this._renderScoreSheet();
    case tabEventKeys.opponentsRanking:
      return this._renderOpponentsRanking();
    case tabEventKeys.opponentsFormation:
      return this._renderOpponentFormation();
    case 'admin':
      return <div>ID={this.props.match.id}<br />FrenoyId={this.props.match.frenoyMatchId}</div>;
    }
    return 'Unknown';
  }

  _renderOpponentClub() {
    return <OpponentClubLocations club={this.props.match.getOpponentClub()} t={this.context.t} />;
  }
  _renderIndividualMatches() {
    return <IndividualMatches match={this.props.match} ownPlayerId={this.props.user.playerId} t={this.context.t} />;
  }
  _renderOpponentsRanking() {
    return <OpponentsLastMatches match={this.props.match} />;
  }
  _renderOpponentFormation() {
    var formations = storeUtils.matches
      .getFormation(this.props.match)
      .sort((a, b) => a.count < b.count ? 1 : -1);
    return <OpponentsFormation formations={formations} />;
  }
  _renderScoreSheet() {
    return (<Scoresheet match={this.props.match} t={this.context.t} />);
  }
  _renderReport() {
    return <MatchReport match={this.props.match} t={this.context.t} user={this.props.user} />;
  }


  _renderPlayers() {
    var match = this.props.match;
    var team = match.getTeam();

    if (match.players.size === team.getTeamPlayerCount() * 2) {
      // TODO: check here for Frenoy sync?
      return <MatchPlayerResults match={match} team={match.getTeam()} t={this.context.t} />;
    }

    if (this.state.forceEditPlayers) {
      return <SelectPlayersForm match={match} user={this.props.user} />;
    }

    // TODO: if canmanageteams and match.players.size !== team.getTeamPlayerCount() * 2 == manage teams

    if (this.props.user.playerId) {
      // TODO: don't check for logged in but check for match.scoreType === 'BeingPlayed' / 'IsPlayed'
      // --> a non logged in use can not see the formation/opstelling when the match is NotYetPlayed
      //     and since "opstellingen" will (later) not be returned from the backend when not logged in, this logic becomes simpler
      if (match.players.size === team.getTeamPlayerCount() && !this.state.forceEditPlayers) {
        return <PlayersGallery players={match.getOwnPlayerModels()} user={this.props.user} competition={team.competition} />;
      }

      if (this.props.user.canManageTeam(match.teamId) && (match.date.isAfter(moment(), 'hours') || match.players.size !== team.getTeamPlayerCount())) {
        return <SelectPlayersForm match={match} user={this.props.user} />;
      }

      if (match.players.size) {
        return <PlayersGallery players={match.getOwnPlayerModels()} user={this.props.user} competition={team.competition} />;
      }
    }

    var standardPlayers = team.getPlayers('standard').map(ply => ply.player);
    return <PlayersGallery players={standardPlayers} user={this.props.user} competition={team.competition} />;
  }
}



const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    marginBottom: -8
  },
};
// TODO: cols must be set to two on small devices (window.innerWidth + need onResize eventHandler)
const PlayersGallery = ({players, user, competition}) => (
  <div style={gridStyles.root}>
    <GridList
      cellHeight={200}
      cols={4}
      style={gridStyles.gridList}>
      {players.map(ply => {
        var comp = ply.getCompetition(competition);
        return (
          <GridTile
            key={ply.id}
            title={<span><span>{ply.name}</span> <small>{comp ? comp.ranking : '??'}</small></span>}
            subtitle={user.playerId ? <Telephone number={ply.contact.mobile} /> : <PlayerPlayingStyle ply={ply} />}>
            <PlayerImage playerId={ply.id} />
          </GridTile>
        );
      })}
    </GridList>
  </div>
);

const PlayerPlayingStyle = ({ply}) => (
  <span>{ply.style.name}<br />{ply.style.bestStroke}</span>
);


const PlayerImage = ({playerId}) => (
  <img src={'/img/players/' + playerId + '.jpg'} />
);
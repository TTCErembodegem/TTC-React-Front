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
  opponents: 6,
};

@connect(state => {
  return {
    config: state.config,
    // user: state.user,
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
    type: PropTypes.string.isRequired,
    getLastOpponentMatches: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      openTabKey: tabEventKeys.players,
      forceEditPlayers: false
    };
  }

  render() {
    var match = this.props.match;
    var showIndividualMatches = match.games.size !== 0;
    return (
      <MatchCardHeader {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            {this._renderNavItem(tabEventKeys.players, 'players', this._getPlayersEditIcon())}
            {showIndividualMatches ? this._renderNavItem(tabEventKeys.individualMatches, 'matches') : null}
            {!match.isHomeMatch ? this._renderNavItem(tabEventKeys.opponentClub, 'club') : null}
            {!match.isPlayed ? this._renderNavItem(tabEventKeys.scoresheet, 'scoresheet') : null}
            {!match.isPlayed ? this._renderNavItem(tabEventKeys.opponents, 'opponents') : null}
            {this._renderNavItem(tabEventKeys.report, 'report')}
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
    return playerSelectionComplete && isAllowedToEdit ? (
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
    case tabEventKeys.opponents:
      return this._renderOpponentsIntel();
    }
    return 'Unknown';
  }

  _renderOpponentClub() {
    return <OpponentClubLocations club={this.props.match.getOpponentClub()} t={this.context.t} />;
  }
  _renderIndividualMatches() {
    return <IndividualMatches match={this.props.match} ownPlayerId={this.props.user.playerId} t={this.context.t} />;
  }
  _renderOpponentsIntel() {
    var matches = storeUtils.matches
      .getFromOpponent(this.props.match.opponent)
      .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1);
    //console.log('_renderOpponentsIntel', matches.toArray());

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th>{this.context.t('match.opponents.date')}</th>
            <th>{this.context.t('match.opponents.homeTeam')}</th>
            <th>{this.context.t('match.opponents.awayTeam')}</th>
            <th>{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id} className={match.won(this.props.match.opponent) ? 'accentuate success' : ''}>
              <td>{match.getDisplayDate('d')}</td>
              <td>{match.getClub('home').name} {match.home.teamCode}</td>
              <td>{match.getClub('away').name} {match.away.teamCode}</td>
              <td>{match.score.home} - {match.score.out}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }



  _renderScoreSheet() {
    var competition = this.props.match.getTeam().competition;
    // TODO: display this in table exactly like on the scoresheet... (like IndividualMatches.js)
    return (
      <div className="match-card-tab-content">
        <h3>{this.props.match.frenoyMatchId}</h3>
        {this.props.match.getOwnPlayerModels().map(player => {
          var comp = player.getCompetition(competition);
          return (
            <div>
              {player.name}<br />
              {comp.ranking}<br />
              {comp.position}<br />
              {comp.uniqueIndex}<br />
            </div>
          );
        })}
      </div>
    );
  }


  _renderReport() {
    return (
      <div>{this.props.match.id} {this.props.match.frenoyMatchId}</div>
    );
  }


  _renderPlayers() {
    var match = this.props.match;
    var team = match.getTeam();

    if (match.players.size === team.getTeamPlayerCount() * 2) {
      return <MatchPlayerResults match={match} team={match.getTeam()} t={this.context.t} />;
    }

    if (this.props.user.playerId) {
      if (match.players.size === team.getTeamPlayerCount() && !this.state.forceEditPlayers) {
        return <PlayersGallery players={match.getOwnPlayerModels()} user={this.props.user} competition={team.competition} />;
      }

      if (this.props.user.canManageTeam(match.teamId) && match.date.isAfter(moment(), 'hours')) {
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
      {players.map(ply => (
        <GridTile
          key={ply.id}
          title={<span><span>{ply.name}</span> <small>{ply.getCompetition(competition).ranking}</small></span>}
          subtitle={!user.playerId ? <Telephone number={ply.contact.mobile} /> : <PlayerPlayingStyle ply={ply} />}>
          <PlayerImage playerId={ply.id} />
        </GridTile>
      ))}
    </GridList>
  </div>
);

const PlayerPlayingStyle = ({ply}) => (
  <span>{ply.style.name}<br />{ply.style.bestStroke}</span>
);


const PlayerImage = ({playerId}) => (
  <img src={'/img/players/' + playerId + '.jpg'} />
);
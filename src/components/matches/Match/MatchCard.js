import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import UserModel from '../../../models/UserModel.js';
import MatchModel from '../../../models/MatchModel.js';
import { getPlayersPerTeam } from '../../../models/TeamModel.js';

import MatchCardHeader from './MatchCardHeader.js';
import MatchPlayers from './MatchPlayers.js';
import IndividualMatches from './IndividualMatches.js';
import OpponentClubLocations from './OpponentClubLocations.js';
import PlayerAvatarList from '../../players/PlayerAvatarList.js';

import Icon from '../../controls/Icon.js';
import Telephone from '../../controls/Telephone.js';

import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
// import cn from 'classnames';

const tabEventKeys = {
  players: 1,
  individualMatches: 2,
  report: 3,
  opponentClub: 4
};

export default class MatchCard extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
    type: PropTypes.string.isRequired
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
    var playerSelectionComplete = match.players.size === getPlayersPerTeam(team.competition);
    return playerSelectionComplete ? <Icon fa="fa fa-pencil-square-o" onClick={::this._onStartEditPlayers} className="match-card-tab-icon" /> : null;
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
    }
    return 'Unknown';
  }

  _renderOpponentClub() {
    return <OpponentClubLocations club={this.props.match.getOpponentClub()} t={this.context.t} />;
  }
  _renderIndividualMatches() {
    return <IndividualMatches match={this.props.match} ownPlayerId={this.props.user.playerId} t={this.context.t} />;
  }


  _renderReport() {
    return (
      <div></div>
    );
  }


  _renderPlayers() {
    var match = this.props.match;
    var team = match.getTeam();

    if (match.scoreType === 'NotYetPlayed' && !this.props.user.playerId) {
      return <div>Classified :)</div>; // TODO: show some default info for normal visitors

    } else if (match.players.size === getPlayersPerTeam(team.competition) * 2) {
      return <MatchPlayers match={match} team={this.props.match.getTeam()} t={this.context.t} />;

    } else if (match.players.size === getPlayersPerTeam(team.competition) && !this.state.forceEditPlayers) {
      //return <PlayersSelected match={this.props.match} user={this.props.user} />;
      return <PlayersSelectedFull match={this.props.match} user={this.props.user} />;
    }

    return <PlayersSelect match={this.props.match} user={this.props.user} />;
  }
}

const teamPlayerType = {
  standard: 'Standard',
  captain: 'Captain',
  reserve: 'Reserve',
};

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



// TODO: cols must be set to two on small devices
const PlayersSelectedFull = ({match, user}) => (
  <div style={gridStyles.root}>
    <GridList
      cellHeight={200}
      cols={4}
      style={gridStyles.gridList}>
      {match.getOwnPlayerModels().map(ply => (
        <GridTile
          key={ply.id}
          title={ply.alias}
          subtitle={<Telephone number={ply.contact.mobile} />}>
          <PlayerImage playerId={ply.id} />
        </GridTile>
      ))}
    </GridList>
  </div>
);

const PlayerImage = ({playerId}) => (
  <img src={'/img/players/' + playerId + '.jpg'} />
);

class PlayersSelect extends Component {
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
  }

  render() {
    var content;


    if (this.props.user.canManageTeams(this.props.match.teamId)) {
      content = this._renderPlayersSelectForm();

    } else if (!this.props.match.players.size) {
      content = 'Nog geen spelers ';


    } else {
      content = 'whee';
    }

    return (
      <div>
        {content}
      </div>
    );
  }

  _renderPlayersSelectForm() {
    var team = this.props.match.getTeam();
    var reservePlayers = team.getPlayers('reserve');

    return (
      <div>
        <PlayerAvatarList players={team.getPlayers('standard')} match={this.props.match} />
        {reservePlayers.size ? <Divider /> : null}
        {reservePlayers.size ? <PlayerAvatarList players={reservePlayers} match={this.props.match} /> : null}
        <Divider />
      </div>
    );
  }
}
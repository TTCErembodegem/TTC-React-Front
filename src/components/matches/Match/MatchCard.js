import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import UserModel from '../../../models/UserModel.js';
import MatchModel from '../../../models/MatchModel.js';
import MatchReportModel from '../../../models/MatchReportModel.js';
import { getPlayersPerTeam } from '../../../models/TeamModel.js';

import MatchCardHeader from './MatchCardHeader.js';
import MatchPlayers from './MatchPlayers.js';
import IndividualMatches from './IndividualMatches.js';
import OpponentClubLocations from './OpponentClubLocations.js';

import Icon from '../../controls/Icon.js';
import Telephone from '../../controls/Telephone.js';
import CardText from 'material-ui/lib/card/card-text';
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
      openTabKey: tabEventKeys.players
    };
  }

  render() {
    var match = this.props.match;
    var showIndividualMatches = match.report.players.length !== 0;
    return (
      <MatchCardHeader {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            {this._renderNavItem(tabEventKeys.players, 'players')}
            {showIndividualMatches ? this._renderNavItem(tabEventKeys.individualMatches, 'matches') : null}
            {!match.isHomeMatch ? this._renderNavItem(tabEventKeys.opponentClub, 'club') : null}
            {this._renderNavItem(tabEventKeys.report, 'report')}
          </Nav>
          {this._renderTabContent()}
        </CardText>
      </MatchCardHeader>
    );
  }
  _renderNavItem(eventKey, tKey) {
    return (
      <NavItem eventKey={eventKey} title={this.context.t(`match.tabs.${tKey}Title`)}>
        {this.context.t(`match.tabs.${tKey}`)}
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
    return <IndividualMatches report={this.props.match.report} ownPlayerId={this.props.user.playerId} t={this.context.t} />;
  }


  _renderReport() {
    return (
      <div></div>
    );
  }


  _renderPlayers() {
    var report = this.props.match.report;
    var team = this.props.match.getTeam();
    if (report.players.length === getPlayersPerTeam(team.competition) * 2) {
      return <MatchPlayers report={report} team={this.props.match.getTeam()} t={this.context.t} />;
    }

    //if (this.props.type === 'today' && match starts in 30min) {
    //}

    return <PlayersSelect match={this.props.match} user={this.props.user} />;
  }
}



class PlayersSelect extends Component {
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.instanceOf(UserModel).isRequired,
  }

  render() {
    console.log(this.props.match);

    var content;
    if (!this.props.user.playerId) {
      content = 'Classified :)';

    } else if (this.props.user.canManageTeams(this.props.match.teamId)) {
      let team = this.props.match.getTeam();
      console.log(team.getPlayers());
      content = <span>{team.getPlayers().map(x => x.name)}</span>;

    } else if (!this.props.match.report.players.length) {
      content = 'Nog geen spelers ';


    } else {
      content = 'whee';
    }

    return (
      <div>
        <h3>Kies spelers</h3>
        {content}
      </div>
    );
  }
}
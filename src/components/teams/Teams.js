import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MatchModel from '../../models/MatchModel.js';
import TeamModel from '../../models/TeamModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';
import withViewport from '../../utils/decorators/withViewport.js';

import CardText from 'material-ui/lib/card/card-text';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

import Strike from '../controls/Strike.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';

import Table from 'react-bootstrap/lib/Table';

import * as matchActions from '../../actions/matchActions.js';

export const TeamsVttl = () => <Teams competition="Vttl" />;
export const TeamsSporta = () => <Teams competition="Sporta" />;

@withViewport
@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
}, matchActions)
export default class Teams extends Component {
  static contextTypes = contextTypes;
  constructor(props) {
    super(props);
    this.state = {openTabKey: this._getTeamIdOfATeam(props.teams)};
  }

  static propTypes = {
    competition: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
    viewport: PropTypes.object.isRequired,
    getMatchesForTeam: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.getMatchesForTeam(this._getTeamIdOfATeam(this.props.teams));
  }

  _getTeamIdOfATeam(teams) {
    return teams.find(x => x.competition === this.props.competition && x.teamCode === 'A').id;
  }

  _showAccordion() {
    // Otherwise show tabs
    return this.props.viewport.width < 700;
  }
  _onTabSelect(teamId) {
    if (this.props.config.get('matchesForTeamLoaded').indexOf(teamId) === -1) {
      this.props.getMatchesForTeam(teamId);
    }
    this.setState({openTabKey: teamId});
  }

  _getTeamsPanel() {
    var teams = this.props.teams.filter(team => team.competition === this.props.competition);
    return teams.map(team =>
      <Panel header={this._renderRanking(team)} eventKey={team.id} onClick={this._onTabSelect.bind(this, team.id)}>
          {this._getTeamMatches(team)}
      </Panel>
    );
  }

  _renderRanking(team){
    const ranking = team.getDivisionRanking();
    return (<div>{team.competition + ' ' + team.teamCode}&nbsp;&nbsp;
      <span className="label label-as-badge label-default">{this._renderOwnTeamPosition(team)}
      </span></div>
    );
  }

  _renderOwnTeamPosition(team) {
    const ranking = team.getDivisionRanking();
    return ranking ? ranking.position : '?';
  }

  _openMatch(matchId) {
    const matchRoute = this.context.t.route('match', {matchId: matchId});
    browserHistory.push(matchRoute);
  }

  _getTeamMatches(team){
    var matchesForTeam = team.getMatches().sort((a,b) => a.date - b.date);
    return (
       <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>{this.context.t('teamCalendar.date')}</th>
                <th>{this.context.t('teamCalendar.hour')}</th>
                <th>{this.context.t('teamCalendar.match')}</th>
                <th>{this.context.t('teamCalendar.score')}</th>
              </tr>
            </thead>
            <tbody>
             {matchesForTeam.map(match => {
               return (
                <tr key={match.id} onClick={this._openMatch.bind(this, match.id)} className="clickable">
                  <td>{match.date.format('DD/MM')}</td>
                  <td>{match.date.format('HH:mm')}</td>
                  <td>{match.isHomeMatch ? this._renderOwnTeamTitle(team) : this._renderOpponentTitle(match)} -
                  {match.isHomeMatch ? ' ' + this._renderOpponentTitle(match) : ' ' + this._renderOwnTeamTitle(team)}</td>
                  <td>{this._renderScores(match)}</td>
                </tr>
              );
             })}
            </tbody>
        </table>
      );
  }

  _renderScores(match){
    if (match.score.home === 0 && match.score.out === 0) {
      return '';
    } else {
      return match.score.home + ' - ' + match.score.out;
    }
  }

  _renderOwnTeamTitle(team) {
    return team.competition + ' ' + team.teamCode;
  }

  _renderOpponentTitle(match) {
    const club = match.getOpponentClub();
    return club.name + ' ' + match.opponent.teamCode;
  }

  _getTeamsNavigation() {
    var teams = this.props.teams.filter(team => team.competition === this.props.competition);
    return teams.map(team =>
      <NavItem eventKey={team.id}>
          <div>{team.competition + ' ' + team.teamCode}&nbsp;&nbsp;
          <span className="label label-as-badge label-default">{this._renderOwnTeamPosition(team)}</span></div>
      </NavItem>
      );
  }

  _getDivsForTeamsNavigation() {
    var team = this.props.teams.find(t => t.id === this.state.openTabKey);
    return (
      <div>
        {this._getTeamMatches(team)}
      </div>
    );
  }

  render() {

    if (this._showAccordion()) {
      return (
        <div style={{marginTop: 10}}>
          <CardText expandable={true} style={{paddingTop: 0, paddingLeft: 5, paddingRight: 5}}>
            <PanelGroup activeKey={this.state.openTabKey} onSelect={::this._onTabSelect} accordion>
              {this._getTeamsPanel()}
            </PanelGroup>
          </CardText>
        </div>
      );
    }

    return (
      <div style={{marginTop: 10}}>
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            {this._getTeamsNavigation()}
          </Nav>
          {this._getDivsForTeamsNavigation()}
        </CardText>
      </div>
    );
  }
}
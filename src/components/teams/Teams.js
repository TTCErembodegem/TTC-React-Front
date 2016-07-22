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

import { OwnClubId } from '../../models/ClubModel.js';

import { util as storeUtil } from '../../store.js';
import * as matchActions from '../../actions/matchActions.js';

import cn from 'classnames';
import styles from './Teams.css';
import withStyles from '../../utils/decorators/withStyles.js';

export const TeamsVttl = () => <Teams competition="Vttl" />;
export const TeamsSporta = () => <Teams competition="Sporta" />;

@withViewport
@withStyles(styles)
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
          {this._getRankingOfDivision(team)}
      </Panel>
    );
  }

  _renderRanking(team){
    var style = this._getLabelClassName(team);
    return (<div>{team.competition + ' ' + team.teamCode}&nbsp;&nbsp;
      <span className={style}>{this._renderOwnTeamPosition(team)}
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
               return this._getMatch(match,team);
             })}
            </tbody>
        </table>
      );
  }

  _getMatch(match,team) {
    return (
       <tr key={match.id} className={cn('clickable',{'match-won': this._won(match)})} onClick={this._openMatch.bind(this, match.id)}>
          <td>{match.date.format('DD/MM')}</td>
          <td>{match.date.format('HH:mm')}</td>
          <td>{match.isHomeMatch ? this._renderOwnTeamTitle(team) : this._renderOpponentTitle(match)} -
             {match.isHomeMatch ? ' ' + this._renderOpponentTitle(match) : ' ' + this._renderOwnTeamTitle(team)}</td>
          <td>{this._renderScores(match)}</td>
       </tr>
    );
  }


  _won(match) {
    if (match.score.home === match.score.out) {
      return false;
    }

    if (match.isHomeMatch) {
      return match.score.home > match.score.out;
    }
    else {
      return match.score.out > match.score.home;
    }
  }

  _getRankingOfDivision(team) {
    var teamsForRanking = team.ranking;
    if (this._showAccordion()) {
      return (
        <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>{this.context.t('teamCalendar.position')}</th>
                  <th>{this.context.t('teamCalendar.name')}</th>
                  <th>{this.context.t('teamCalendar.points')}</th>
                </tr>
              </thead>
              <tbody>
               {teamsForRanking.map(teamRanking => {
                 return this._getRankingAccordeon(teamRanking);
               })}
              </tbody>
          </table>
      );
    }
    return (
      <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>{this.context.t('teamCalendar.position')}</th>
                <th>{this.context.t('teamCalendar.name')}</th>
                <th>{this.context.t('teamCalendar.matchesWon')}</th>
                <th>{this.context.t('teamCalendar.matchesLost')}</th>
                <th>{this.context.t('teamCalendar.matchesDraw')}</th>
                <th>{this.context.t('teamCalendar.points')}</th>
              </tr>
            </thead>
            <tbody>
             {teamsForRanking.map(teamRanking => {
               return this._getRanking(teamRanking);
             })}
            </tbody>
        </table>
    );
  }

  _getTeamName(clubId) {
    return storeUtil.getClub(clubId).name;
  }

  _getRankingAccordeon(teamRanking) {
    return (
        <tr className={cn({'yellowBackground' : teamRanking.clubId === OwnClubId, 'accentuateRanking': teamRanking.clubId === OwnClubId})} key={teamRanking.clubId + teamRanking.teamCode}>
          <td>{teamRanking.position}</td>
          <td>{storeUtil.getClub(teamRanking.clubId).name + ' ' + teamRanking.teamCode}</td>
          <td>{teamRanking.points}</td>
        </tr>
    );
  }

  _getRanking(teamRanking) {
    return (
        <tr className={cn({'yellowBackground' : teamRanking.clubId === OwnClubId, 'accentuateRanking': teamRanking.clubId === OwnClubId})} key={teamRanking.clubId + teamRanking.teamCode}>
          <td>{teamRanking.position}</td>
          <td>{storeUtil.getClub(teamRanking.clubId).name + ' ' + teamRanking.teamCode}</td>
          <td>{teamRanking.gamesWon}</td>
          <td>{teamRanking.gamesLost}</td>
          <td>{teamRanking.gamesDraw}</td>
          <td>{teamRanking.points}</td>
        </tr>
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
       this._getTeamsNavigationTab(team)
    );
  }

  _getTeamsNavigationTab(team) {
    var style = this._getLabelClassName(team);
    return ( <NavItem eventKey={team.id}>
          <div>{team.competition + ' ' + team.teamCode}&nbsp;&nbsp;
          <span className={style}>{this._renderOwnTeamPosition(team)}</span></div>
      </NavItem>
    );
  }

  _getLabelClassName(team) {
    if (team.isTopper(this._renderOwnTeamPosition(team))) {return 'label label-as-badge label-success';}
    if (team.isInDegradationZone(this._renderOwnTeamPosition(team))) {return 'label label-as-badge label-danger';}
    return 'label label-as-badge label-default';
  }

  _getDivsForTeamsNavigation() {
    var team = this.props.teams.find(t => t.id === this.state.openTabKey);
    return (
      <div>
        {this._getTeamMatches(team)}
        {this._getRankingOfDivision(team)}
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
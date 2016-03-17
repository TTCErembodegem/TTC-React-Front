import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import moment from 'moment';

import MatchModel from '../../../models/MatchModel.js';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchScore from '../MatchScore.js';
import Icon from '../../controls/Icon.js';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

const daysAgoBackFullDate = 7;

export default class MatchCardHeader extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    children: PropTypes.node,
    user: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  // TODO: op heenronde score klikken: naar match gaan

  render() {
    var match = this.props.match;
    var iPlay = this.props.user.playsIn(match.teamId);

    var subtitle = [];
    if (match.date.isSame(moment(), 'day') && match.isHomeMatch) {
      subtitle.push(<span style={{marginRight: 9}} key="1">{match.frenoyMatchId}</span>);
      subtitle.push(<span key="2">{this.context.t('match.date', match.getDisplayDate())}</span>);
    } else {
      subtitle.push(
        <span key="2">{match.date > moment() || match.date < moment().add(-daysAgoBackFullDate, 'day') ?
          this.context.t('match.date', match.getDisplayDate())
          : match.date.fromNow()}
        </span>
      );
    }
    if (match.comments.size || match.description) {
      subtitle.push(
        <span key="3" style={{marginLeft: 9, color: '#d3d3d3'}}>
          {match.comments.size ? <small>{match.comments.size}</small> : null}
          <Icon fa="fa fa-comment-o" />
        </span>
      );
    }
    return (
      <Card style={{backgroundColor: '#fafafa'}} onExpandChange={::this._onExpandChange} initiallyExpanded={this.props.isOpen}>
        <CardHeader
          title={this._renderTitle(match)}
          subtitle={subtitle}
          showExpandableButton={false}
          actAsExpander={!this.props.isOpen}
          avatar={iPlay && !this.props.isOpen ? <FavoriteMatch /> : null}>
          <MatchScore match={match} />
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }

  _renderTitle(match) {
    var team = match.getTeam();
    if (match.isHomeMatch) {
      return (
        <div>
          {this._renderOwnTeamTitle(team)}
          {!match.isPlayed ? this._renderOwnTeamPosition(team) : ' '}
          <span className="match-opponent-team">{this.context.t('match.vs')}</span>
          {!match.isPlayed ? this._renderOpponentPosition(match) : ' '}
          {this._renderOpponentTitle(match)}
        </div>
      );
    } else {
      return (
        <div>
          {this._renderOpponentTitle(match)}
          {!match.isPlayed ? this._renderOpponentPosition(match) : ' '}
          <span className="match-opponent-team">{this.context.t('match.vs')}</span>
          {!match.isPlayed ? this._renderOwnTeamPosition(team) : ' '}
          {this._renderOwnTeamTitle(team)}
        </div>
      );
    }
  }

  _renderOwnTeamTitle(team) {
    return (<span>{team.competition} {team.teamCode}</span>);
  }
  _renderOwnTeamPosition(team) {
    var ranking = team.getDivisionRanking();
    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 25}}>
        {ranking ? ranking.position : '?'}
      </span>
    );
  }

  _renderOpponentTitle(match) {
    var club = match.getOpponentClub();
    return (<span className="match-opponent-team">{club.name} {match.opponent.teamCode}</span>);
  }
  _renderOpponentPosition(match) {
    var club = match.getOpponentClub();
    var ranking = match.getTeam().getDivisionRanking(club.id, match.opponent.teamCode);
    if (!ranking) {
      // TODO: check what is going on here? Galmaarden E heeft algemeen forfait gegeven ofzo?
      // --> Dit gaat nu sowieso het geval zijn omdat deze in een aparte request komen...
      // --> of die mss 10u cachen?
      // console.log('_renderOpponentPosition', club.id, match.opponent.teamCode);
      // console.log('_renderOpponentPosition', match.getTeam());
      // console.log('_renderOpponentPosition', match);
      ranking = {position: '?'};
    }

    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 25}}>
        {ranking.position}
      </span>
    );
  }

  _onExpandChange(/*isOpen*/) {
    var matchRoute = this.context.t.route('match', {matchId: this.props.match.id});
    browserHistory.push(matchRoute);
  }
}
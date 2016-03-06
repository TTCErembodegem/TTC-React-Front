import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import moment from 'moment';

import MatchModel from '../../../models/MatchModel.js';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchScore from '../MatchScore.js';

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
    return (
      <Card style={{backgroundColor: '#fafafa'}} onExpandChange={::this._onExpandChange} initiallyExpanded={this.props.isOpen}>
        <CardHeader
          title={this._renderTitle(match)}
          subtitle={subtitle}
          showExpandableButton={false}
          actAsExpander={!this.props.isOpen}
          avatar={iPlay ? <FavoriteMatch /> : null}>
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
    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 25}}>
        {team.getDivisionRanking().position}
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
    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 25}}>
        {ranking.position}
      </span>
    );
  }

  _onExpandChange(/*isOpen*/) {
    browserHistory.push('/match/' + this.props.match.id);
  }
}
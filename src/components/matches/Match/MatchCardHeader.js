import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import moment from 'moment';

import MatchModel from '../../../models/MatchModel.js';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchForm from '../Match/MatchForm.js';
import MatchScore from '../MatchScore.js';
import Icon from '../../controls/Icon.js';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

const daysAgoBackFullDate = 7;

function renderOwnTeamTitle(team) {
  return team.competition + ' ' + team.teamCode;
}
function renderOpponentTitle(match) {
  const club = match.getOpponentClub();
  return club.name + ' ' + match.opponent.teamCode;
}

export class BigMatchCardHeader extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    children: PropTypes.node,
    user: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  render() {
    const match = this.props.match;
    const team = match.getTeam();
    const us = renderOwnTeamTitle(team);
    const them = renderOpponentTitle(match);

    return (
      <Card style={{backgroundColor: '#fafafa'}} initiallyExpanded={true}>
        <CardHeader
          title={<span style={{fontSize: 34}}>{match.isHomeMatch ? `${us} vs ${them}` : `${them} vs ${us}`}</span>}
          subtitle={undefined}
          style={{height: 95}}
          showExpandableButton={false}
          actAsExpander={false}>
          <div style={{position: 'absolute', top: 23, right: 15}}>
            <MatchForm match={match} t={this.context.t} user={this.props.user} />
          </div>
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }
}

export default class MatchCardHeader extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    children: PropTypes.node,
    user: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  // TODO: op heenronde score klikken: naar match gaan
  // TODO: implement fancy tooltip https://github.com/callemall/material-ui/blob/master/src/tooltip.jsx?
  // TODO: TOPPER/THRILLER (fa-heartbeat?) wanneer eerste/laatste 3 in ranking tegen elkaar spelen

  render() {
    const match = this.props.match;
    const iPlay = this.props.user.playsIn(match.teamId);

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
          <MatchScore match={match} style={{position: 'absolute', top: 14, right: 0, marginRight: 7, fontSize: 16, marginLeft: 12, float: 'right'}} />
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }

  _renderTitle(match) {
    const team = match.getTeam();
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
    return (<span>{renderOwnTeamTitle(team)}</span>);
  }
  _renderOpponentTitle(match) {
    return (<span className="match-opponent-team">{renderOpponentTitle(match)}</span>);
  }

  _renderOwnTeamPosition(team) {
    const ranking = team.getDivisionRanking();
    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 25}}>
        {ranking ? ranking.position : '?'}
      </span>
    );
  }
  _renderOpponentPosition(match) {
    const club = match.getOpponentClub();
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
    const matchRoute = this.context.t.route('match', {matchId: this.props.match.id});
    browserHistory.push(matchRoute);
  }
}
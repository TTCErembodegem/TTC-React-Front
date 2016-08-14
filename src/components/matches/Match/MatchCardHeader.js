import React, { Component } from 'react';
import PropTypes from '../../PropTypes.js';
import { browserHistory } from 'react-router';
import moment from 'moment';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchForm from '../Match/MatchForm.js';
import MatchScore from '../MatchScore.js';
import Icon from '../../controls/Icon.js';

import { Card, CardHeader } from 'material-ui/Card';

const daysAgoBackFullDate = 7;

export class BigMatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  render() {
    const match = this.props.match;
    const team = match.getTeam();
    const us = team.renderOwnTeamTitle();
    const them = match.renderOpponentTitle();

    return (
      <Card style={{backgroundColor: '#fafafa'}} initiallyExpanded={true}>
        <CardHeader
          title={<span style={{fontSize: 34}}>{match.isHomeMatch ? `${us} vs ${them}` : `${them} vs ${us}`}</span>}
          subtitle={undefined}
          style={{height: 95}}
          showExpandableButton={false}
          actAsExpander={false}>
          <div style={{position: 'absolute', top: 23, right: 15}}>
            <MatchForm match={match} t={this.context.t} user={this.props.user} big />
          </div>
          {this._getThriller()}
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }

  _getThriller() {
    const match = this.props.match;
    const team = match.getTeam();
    const thrillerType = team.getThriller(match);
    if (thrillerType) {
      const thrillerStyle = {
        position: 'absolute',
        top: 60,
        left: 15,
        fontSize: 16,
        paddingRight: 13,
      };
      return (
        <span className="label label-as-badge label-danger" style={thrillerStyle}>
          <Icon fa="fa fa-heartbeat faa-pulse animated" style={{marginLeft: 3, marginRight: 7, marginTop: 3}} />
          {this.context.t('match.' + thrillerType)}
        </span>
      );
    }
  }
}



export default class SmallMatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func,
    noScoreEdit: PropTypes.bool,
    width: PropTypes.number,
    routed: PropTypes.bool,
  }

  render() {
    const props = Object.assign({
      onOpen: ::this._onOpen
    }, this.props);
    return <MatchCardHeader {...props} />;
  }

  _onOpen(/*isOpen*/) {
    const matchRoute = this.context.t.route('match', {matchId: this.props.match.id});
    browserHistory.push(matchRoute);
  }
}



class MatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    match: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    noScoreEdit: PropTypes.bool,
    width: PropTypes.number,
    routed: PropTypes.bool,
  }

  render() {
    const match = this.props.match;
    const iPlay = this.props.user.playsIn(match.teamId);

    var subtitle = [];
    if (match.date.isSame(moment(), 'day') && match.isHomeMatch) {
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
      var hasNewComment = this.props.config.get('newMatchComment' + match.id);
      subtitle.push(
        <span key="3" style={{marginLeft: 9, color: hasNewComment ? '#E3170D' : '#d3d3d3'}}>
          {match.comments.size ? <small>{match.comments.size}</small> : null}
          <Icon fa="fa fa-comment-o" />
        </span>
      );
    }

    const scoreFormVisible = !this.props.noScoreEdit && this.props.user.canChangeMatchScore(this.props.match);
    const scoreFormInHeader = !!this.props.routed;

    var matchFormStyle;
    const small = scoreFormVisible && this.props.width < 480;
    if (small) {
      matchFormStyle = {position: 'absolute', top: 50, right: 25};
    } else {
      matchFormStyle = {position: 'absolute', top: 23, right: 25};
    }
    const matchForm = (
      <div style={matchFormStyle}>
        <MatchForm match={match} t={this.context.t} user={this.props.user} />
      </div>
    );

    const matchScoreStyle = {position: 'absolute', top: 14, right: 0, marginRight: 7, fontSize: 16, marginLeft: 12, float: 'right'};

    return (
      <Card style={{backgroundColor: '#fafafa'}} onExpandChange={::this._onExpandChange} initiallyExpanded={this.props.isOpen}>
        <CardHeader
          title={this._renderTitle(match)}
          subtitle={subtitle}
          style={{height: small ? 100 : undefined}}
          showExpandableButton={false}
          actAsExpander={!this.props.isOpen}
          avatar={iPlay && !this.props.isOpen && !scoreFormVisible ? <FavoriteMatch /> : null}>

          {!scoreFormVisible ? <MatchScore match={match} style={matchScoreStyle} /> : null}
          {scoreFormVisible && scoreFormInHeader ? matchForm : null}
        </CardHeader>
        {scoreFormVisible && !scoreFormInHeader ? matchForm : null}
        {this.props.children}
      </Card>
    );
  }

  _renderTitle(match) {
    // TODO: if long club names and is FavoriteMatch then title wraps on small devices (ellipsis would be great here)
    const team = match.getTeam();
    if (match.isHomeMatch) {
      return (
        <div>
          <span>{team.renderOwnTeamTitle()}</span>
          {!match.isPlayed ? this._renderOwnTeamPosition(team) : ' '}
          <span className="match-opponent-team">{this.context.t('match.vs')}</span>
          {!match.isPlayed ? this._renderOpponentPosition(match) : ' '}
          <span className="match-opponent-team">{match.renderOpponentTitle()}</span>
        </div>
      );
    } else {
      return (
        <div>
          <span className="match-opponent-team">{match.renderOpponentTitle()}</span>
          {!match.isPlayed ? this._renderOpponentPosition(match) : ' '}
          <span className="match-opponent-team">{this.context.t('match.vs')}</span>
          {!match.isPlayed ? this._renderOwnTeamPosition(team) : ' '}
          <span>{team.renderOwnTeamTitle()}</span>
        </div>
      );
    }
  }

  _renderOwnTeamPosition(team) {
    const ranking = team.getDivisionRanking();
    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 5}}>
        {ranking ? ranking.position : '?'}
      </span>
    );
  }
  _renderOpponentPosition(match) {
    var ranking = match.getTeam().getDivisionRanking(match.opponent);
    if (!ranking) {
      ranking = {position: '?'};
    }

    return (
      <span className="label label-as-badge label-info" style={{marginLeft: 5, marginRight: 5, paddingTop: 5}}>
        {ranking.position}
      </span>
    );
  }

  _onExpandChange(isOpen) {
    if (this.props.onOpen) {
      this.props.onOpen(isOpen);
    }
  }
}
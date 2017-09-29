import React, {Component} from 'react';
import PropTypes, {browserHistory, browseTo} from '../../PropTypes.js';
import moment from 'moment';

import MatchForm from '../Match/MatchForm.js';
import MatchScore from '../MatchScore.js';
import {Icon, ThrillerBadge, ThrillerIcon, CommentIcon} from '../../controls/Icon.js';
import MatchVs from './MatchVs.js';

import {Card, CardHeader} from 'material-ui/Card';

const daysAgoBackFullDate = 7;

const thrillerIconWith = 25;
const ThrillerIconSpan = <span key="1" style={{width: thrillerIconWith, float: 'left'}}>&nbsp;</span>;

// BigMatchCardHeader == MatchesToday on Club monitor
export class BigMatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    forceEdit: PropTypes.bool,
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
          <ThrillerBadge t={this.context.t} match={match} />
        </CardHeader>
        {this.props.children}
      </Card>
    );
  }
}




export default class SmallMatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    forceEdit: PropTypes.bool,
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
    forceEdit: PropTypes.bool,
    onOpen: PropTypes.func.isRequired,
    noScoreEdit: PropTypes.bool,
    width: PropTypes.number,
    routed: PropTypes.bool,
  }

  render() {
    const match = this.props.match;
    const iPlay = this.props.user.playsIn(match.teamId);

    const scoreFormVisible = !this.props.noScoreEdit && (match.isBeingPlayed() || this.props.forceEdit) && this.props.user.canChangeMatchScore(this.props.match);
    const scoreFormInHeader = !!this.props.routed;
    const smallAndScoring = scoreFormVisible && this.props.width < 480;

    var subtitle = [];
    subtitle.push(ThrillerIconSpan);

    if (!smallAndScoring) {
      // The date and scoring form overlapped on small devices
      // --> ScoreForm is on Today matches, so displaying the date is not really necessary
      subtitle.push(<span key="2">{this.context.t('match.date', match.getDisplayDate())}</span>);
    }

    if (match.comments.size || match.description) {
      const hasNewComment = this.props.config.get('newMatchComment' + match.id);
      subtitle.push(
        <span key="3" style={{marginLeft: 9, color: hasNewComment ? '#E3170D' : '#d3d3d3'}}>
          {match.comments.size ? <small>{match.comments.size}</small> : null}
          <CommentIcon />
        </span>
      );
    }

    var matchFormStyle;
    if (smallAndScoring) {
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
      <Card
        style={{backgroundColor: iPlay ? '#F0F0F0' : '#fafafa'}}
        onExpandChange={::this._onExpandChange}
        initiallyExpanded={this.props.isOpen}
      >
        <CardHeader
          title={<MatchCardHeaderSmallTitle match={match} t={this.context.t} withLinks={this.props.isOpen} />}
          subtitle={subtitle}
          style={{height: smallAndScoring ? 100 : undefined, padding: 15}}
          textStyle={{padding: 0}}
          showExpandableButton={false}
          actAsExpander={!this.props.isOpen}
          subtitleStyle={{marginTop: 4}}
        >

          {!scoreFormVisible ? <MatchScore match={match} style={matchScoreStyle} /> : null}
          {scoreFormVisible && scoreFormInHeader ? matchForm : null}
        </CardHeader>
        {scoreFormVisible && !scoreFormInHeader ? matchForm : null}
        {this.props.children}
      </Card>
    );
  }

  _onExpandChange(isOpen) {
    if (this.props.onOpen) {
      this.props.onOpen(isOpen);
    }
  }
}



const MatchCardHeaderSmallTitle = ({match, withLinks, t}) => {
  const team = match.getTeam();
  return (
    <div style={{whiteSpace: 'nowrap'}}>
      {team.getThriller(match) ? <ThrillerIcon color="red" /> : ThrillerIconSpan}

      {match.isHomeMatch ? <OwnTeamTitle match={match} withLinks={withLinks} /> : <TheirTeamTitle match={match} />}

      <span style={{marginLeft: 7, marginRight: 7}}>
        {t('match.vs')}
      </span>

      {!match.isHomeMatch ? <OwnTeamTitle match={match} withLinks={withLinks} /> : <TheirTeamTitle match={match} />}
    </div>
  )
};


const OwnTeamTitle = ({match, withLinks}) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking();

  const title = (
    <span>
      {divisionRanking.position ? divisionRanking.position + '. ' : ''}
      {team.renderOwnTeamTitle()}
    </span>
  );

  if (!withLinks) {
    return title;
  }

  return (
    <a onClick={() => browseTo.team(team)} className="link-hover-underline">
      {title}
    </a>
  );
};


const TheirTeamTitle = ({match}) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking(match.opponent);
  return (
    <span className="match-opponent-team">
      {divisionRanking.position ? divisionRanking.position + '. ' : ''}
      <MatchVs match={match} themOnly={true} />
    </span>
  );
};

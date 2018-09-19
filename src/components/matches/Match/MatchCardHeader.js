import React, {Component} from 'react';
import PropTypes, {browseTo} from '../../PropTypes.js';
import {Link} from 'react-router-dom';

import MatchForm from '../Match/MatchForm.js';
import MatchScore from '../MatchScore.js';
import {ThrillerBadge, ThrillerIcon, CommentIcon} from '../../controls/Icon.js';
import {TheirTeamTitle} from './TheirTeamTitle.js';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

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
      <Card style={{backgroundColor: '#fafafa'}}>
        <CardHeader
          title={<span style={{fontSize: 34}}>{match.isHomeMatch ? `${us} vs ${them}` : `${them} vs ${us}`}</span>}
          subtitle={undefined}
          style={{height: 95}}
        >
          <div style={{position: 'absolute', top: 23, right: 15}}>
            <MatchForm match={match} t={this.context.t} user={this.props.user} big />
          </div>
          <ThrillerBadge t={this.context.t} match={match} />
        </CardHeader>
        <CardContent>
          {this.props.children}
        </CardContent>
      </Card>
    );
  }
}



export class SmallMatchCardHeader extends Component {
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
    history: PropTypes.any.isRequired,
  }

  render() {
    const props = {onOpen: ::this._onOpen, ...this.props};
    return <MatchCardHeader {...props} />;
  }

  _onOpen(/*isOpen*/) {
    const matchRoute = this.context.t.route('match', {matchId: this.props.match.id});
    this.props.history.push(matchRoute);
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

    const scoreFormVisible = !this.props.noScoreEdit &&
      (match.isBeingPlayed() || this.props.forceEdit) &&
      this.props.user.canChangeMatchScore(this.props.match);

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
          <CommentIcon translate tooltip={hasNewComment ? 'match.hasNewComments' : undefined} />
        </span>
      );
    }

    var matchFormStyle;
    if (smallAndScoring) {
      matchFormStyle = {position: 'absolute', top: 50, right: 25};
    } else {
      matchFormStyle = {position: 'absolute', top: 17, right: 7};
    }
    const matchForm = (
      <div style={matchFormStyle}>
        <MatchForm match={match} t={this.context.t} user={this.props.user} />
      </div>
    );

    const matchScoreStyle = {position: 'absolute', top: 14, right: 0, marginRight: 7, fontSize: 16, marginLeft: 12, float: 'right'};

    return (
      <Card style={{backgroundColor: iPlay ? '#F0F0F0' : '#fafafa'}}>
        <CardHeader
          title={<MatchCardHeaderSmallTitle match={match} t={this.context.t} withLinks={this.props.isOpen} />}
          subheader={subtitle}
          style={{height: smallAndScoring ? 100 : undefined, padding: 15}}
        >
          {!scoreFormVisible ? <MatchScore match={match} style={matchScoreStyle} /> : null}
          {scoreFormVisible && scoreFormInHeader ? matchForm : null}
        </CardHeader>
        <CardContent>
          {scoreFormVisible && !scoreFormInHeader ? matchForm : null}
          {this.props.isOpen ? this.props.children : null}
        </CardContent>
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

  const ourTitle = <OwnTeamTitle match={match} withLinks={withLinks} />;
  const theirTitle = <TheirTeamTitle match={match} withLinks={withLinks} />;

  return (
    <div style={{whiteSpace: 'nowrap'}}>
      {team.getThriller(match) ? <ThrillerIcon color="red" /> : ThrillerIconSpan}

      {match.isHomeMatch ? ourTitle : theirTitle}

      <span style={{marginLeft: 7, marginRight: 7}}>
        {t('match.vs')}
      </span>

      {!match.isHomeMatch ? ourTitle : theirTitle}
    </div>
  );
};

MatchCardHeaderSmallTitle.propTypes = {
  match: PropTypes.MatchModel.isRequired,
  withLinks: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};


const OwnTeamTitle = ({match, withLinks}) => {
  const team = match.getTeam();
  const divisionRanking = team.getDivisionRanking();

  const title = team.renderOwnTeamTitle();
  if (!withLinks) {
    return <span>{title}</span>;
  }

  return (
    <span>
      {divisionRanking.position ? <small>{divisionRanking.position + '. '}</small> : ''}
      <Link to={browseTo.getTeam(team)} className="link-hover-underline">
        {title}
      </Link>
    </span>
  );
};

OwnTeamTitle.propTypes = {
  match: PropTypes.MatchModel.isRequired,
  withLinks: PropTypes.bool.isRequired,
};

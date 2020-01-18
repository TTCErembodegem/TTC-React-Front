import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import cn from 'classnames';
import PropTypes, {browseTo, withRouter} from '../../PropTypes';

import MatchForm from './MatchForm';
import MatchScore from '../MatchScore';
import {ThrillerBadge, ThrillerIcon, CommentIcon} from '../../controls/Icon';
import {TheirTeamTitle} from './TheirTeamTitle';

const thrillerIconWith = 25;
const ThrillerIconSpan = <span key="1" style={{width: thrillerIconWith, float: 'left'}}>&nbsp;</span>;

// BigMatchCardHeader == MatchesToday on Club monitor
export class BigMatchCardHeader extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    match2: PropTypes.MatchModel.isRequired,
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    forceEdit: PropTypes.bool,
  }

  render() {
    const match = this.props.match2;
    const team = match.getTeam();
    const us = team.renderOwnTeamTitle();
    const them = match.renderOpponentTitle();

    return (
      <div className="match-card" style={{backgroundColor: '#fafafa'}}>
        <div className="match-card-header">
          <div className="match-card-score">
            <MatchForm match={match} t={this.context.t} user={this.props.user} big />
          </div>
          <span style={{fontSize: 34}}>{match.isHomeMatch ? `${us} vs ${them}` : `${them} vs ${us}`}</span>
          <ThrillerBadge t={this.context.t} match={match} />
        </div>
        {this.props.isOpen ? (
          <div className="match-card-body">
            {this.props.children}
          </div>
        ) : null}
      </div>
    );
  }
}



export class SmallMatchCardHeaderComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    match2: PropTypes.MatchModel.isRequired, //
    children: PropTypes.node,
    user: PropTypes.UserModel.isRequired,
    isOpen: PropTypes.bool.isRequired,
    forceEdit: PropTypes.bool,
    noScoreEdit: PropTypes.bool,
    width: PropTypes.number,
    routed: PropTypes.bool,
    history: PropTypes.any.isRequired,
  }

  render() {
    const {match, match2, history, location, ...props} = this.props; // eslint-disable-line
    const newProps = {match: match2, onOpen: () => this._onOpen(), ...props};
    return <MatchCardHeader {...newProps} />;
  }

  _onOpen(/* isOpen */) {
    const matchRoute = this.context.t.route('match', {matchId: this.props.match2.id});
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
    const {match} = this.props;
    const iPlay = this.props.user.playsIn(match.teamId);

    const scoreFormVisible = !this.props.noScoreEdit
      && (match.isBeingPlayed() || this.props.forceEdit)
      && this.props.user.canChangeMatchScore(this.props.match);

    // const scoreFormInHeader = !!this.props.routed;
    const smallAndScoring = scoreFormVisible && this.props.width < 480;

    const subtitle = [];
    subtitle.push(ThrillerIconSpan);

    if (!smallAndScoring) {
      // The date and scoring form overlapped on small devices
      // --> ScoreForm is on Today matches, so displaying the date is not really necessary
      subtitle.push(<span key="2">{this.context.t('match.date', match.getDisplayDate())}</span>);
    }

    if (match.comments.size || match.description) {
      const hasNewComment = this.props.config.get(`newMatchComment${match.id}`);
      subtitle.push(
        <span key="3" style={{marginLeft: 9, color: hasNewComment ? '#E3170D' : '#d3d3d3'}}>
          {match.comments.size ? <small>{match.comments.size}</small> : null}
          <CommentIcon translate tooltip={hasNewComment ? 'match.hasNewComments' : undefined} />
        </span>,
      );
    }

    const matchForm = (
      <div className={cn({'match-card-score': !smallAndScoring, 'match-card-score-inline': smallAndScoring})}>
        <MatchForm match={match} t={this.context.t} user={this.props.user} />
      </div>
    );

    const onOpenHandler = this.props.onOpen && !this.props.isOpen ? e => this._onExpandChange(e) : undefined;

    return (
      <div className="match-card" style={{backgroundColor: iPlay ? '#F0F0F0' : '#fafafa'}}>
        <div className="match-card-header" style={{height: smallAndScoring ? 110 : 60}} onClick={onOpenHandler}>
          {!scoreFormVisible ? <MatchScore match={match} className="match-card-score" /> : null}
          {scoreFormVisible && !smallAndScoring ? matchForm : null}
          <MatchCardHeaderSmallTitle match={match} t={this.context.t} withLinks={this.props.isOpen} />
          <div className="match-card-header-subtitle">{subtitle}</div>
          {scoreFormVisible && smallAndScoring ? matchForm : null}
        </div>
        {this.props.isOpen ? (
          <div className="match-card-body">
            {this.props.children}
          </div>
        ) : null}
      </div>
    );
  }

  _onExpandChange(event) {
    // console.log('event', event.target.nodeName, event.target);

    const {nodeName} = event.target;
    if (nodeName === 'INPUT' || nodeName === 'A' || nodeName === '') {
      return;
    }

    if (this.props.onOpen) {
      this.props.onOpen(true);
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
      {divisionRanking.position ? <small>{`${divisionRanking.position}. `}</small> : ''}
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

export const SmallMatchCardHeader = withRouter(SmallMatchCardHeaderComponent);

import React, {Component} from 'react';
import {Link} from 'react-router';
import PropTypes, {browserHistory, storeUtil} from '../../PropTypes.js';
import {OwnClubId} from '../../../models/ClubModel.js';
import MatchScore from '../MatchScore.js';
import cn from 'classnames';


export const ViewMatchDetailsButton = ({match, t}) => {
  if (!match.shouldBePlayed) {
    return <div />;
  }

  const score = match.renderScore();
  return (
    <a className={cn({'btn btn-default': !score, clickable: !!score})} onClick={() => browserHistory.push(t.route('match', {matchId: match.id}))}>
      {score ? <MatchScore match={match} style={{fontSize: 16}} showComments /> : t('match.details')}
    </a>
  );
}



export class MatchOtherRoundButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  _gotoMatchCard(match) {
    const matchRoute = this.context.t.route('match', {matchId: match.id});
    browserHistory.push(matchRoute);
  }

  render() {
    const matches = storeUtil.matches
      .getFromOpponent(this.props.match)
      .filter(match => match.id !== this.props.match.id);

    const firstRoundMatchInfo = matches.find(match => (
        (match.home.clubId === OwnClubId && match.home.teamCode === this.props.match.getTeam().teamCode) ||
        (match.away.clubId === OwnClubId && match.away.teamCode === this.props.match.getTeam().teamCode)
      ));

    const firstRoundMatch = firstRoundMatchInfo ? storeUtil.getMatch(firstRoundMatchInfo.id) : null;
    if (!firstRoundMatch) {
      return null;
    }

    const wasPrev = this.props.match.date > firstRoundMatch.date;
    return (
      <Link to={this.context.t.route('match', {matchId: firstRoundMatch.id})}>
        <button type="button" className="btn btn-default"
          onClick={this._gotoMatchCard.bind(this, firstRoundMatch)}
          style={{margin: 7}}>
          <div>
            <span style={{marginRight: 6}}>{this.context.t('match.' + (wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'))}</span>
            <MatchScore match={firstRoundMatch} forceDisplay={true} />
          </div>
        </button>
      </Link>
    );
  }
}

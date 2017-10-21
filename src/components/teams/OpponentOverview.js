import React, {Component} from 'react';
import PropTypes, {connect, storeUtil, browserHistory} from '../PropTypes.js';

import {BackIcon} from '../controls.js';
import {getOpponentMatches} from '../../actions/matchActions.js';
import {OpponentMatches} from '../matches/Match/OpponentMatches.js';
import {TeamRankingBadges} from './controls/TeamRankingBadges.js';
import {TeamPosition} from './controls/TeamPosition.js';
import OpponentsFormation from '../matches/Match/OpponentsFormation.js';
import {OpponentsTeamFormation} from '../matches/Match/OpponentsTeamFormation.js';

@connect(state => ({
  matches: state.matches,
  readonlyMatches: state.readonlyMatches,
  teams: state.teams,
}), {getOpponentMatches})
export class OpponentOverview extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    readonlyMatches: PropTypes.MatchModelList.isRequired,
    getOpponentMatches: PropTypes.func.isRequired,
    params: PropTypes.shape({
      competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
      clubId: PropTypes.string.isRequired,
      teamCode: PropTypes.string,
    }).isRequired,
    history: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this._escIsBack = ::this._escIsBack;
  }

  _getQueryStringValues() {
    const {competition, teamCode} = this.props.params;
    const clubId = parseInt(this.props.params.clubId, 10);
    return {
      competition,
      clubId,
      teamCode,
    };
  }

  _getTeam() {
    const info = this._getQueryStringValues();
    return this.props.teams
      .find(t => t.competition === info.competition && t.ranking.find(x => x.clubId === info.clubId && x.teamCode === info.teamCode));
  }

  _escIsBack(event) {
    if (event.keyCode === 27) {
      browserHistory.goBack();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getOpponentMatches(this._getTeam().id);
    document.addEventListener('keydown', this._escIsBack, false);
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', this._escIsBack, false);
  }

  render() {
    const t = this.context.t;
    const team = this._getTeam();
    const {competition, clubId, teamCode} = this._getQueryStringValues();
    const opponentClub = storeUtil.getClub(clubId);

    const opponent = {clubId, teamCode};
    const otherMatches = this.props.readonlyMatches
      .filter(m => m.competition === competition)
      .filter(m => m.home && m.away)
      .filter(m => (m.home.clubId === clubId && m.home.teamCode === teamCode) || (m.away.clubId === clubId && m.away.teamCode === teamCode))
      .filter(m => m.shouldBePlayed)
      .sort((a, b) => a.date - b.date);

    if (!team || !opponentClub || otherMatches.size === 0) {
      return null;
    }

    return (
      <div style={{marginBottom: 30}}>
        <OpponentOverviewHeader team={team} opponent={opponent} />


        <h3>{t('teamCalendar.individual')}</h3>
        <OpponentsFormation match={otherMatches.first()} opponent={opponent} />

        <h3>{t('teamCalendar.matches')}</h3>
        <OpponentMatches team={team} readonlyMatches={otherMatches} roundSwitchButton opponent={opponent} />
      </div>
    );
  }
}


class OpponentOverviewHeader extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  render() {
    const {team, opponent} = this.props;
    const opponentClub = storeUtil.getClub(opponent.clubId);
    return (
      <h1>
        <BackIcon className="pull-right" />
        <span>
          {opponentClub.name}: {team.competition} {opponent.teamCode}
        </span>

        <br />
        <small>
          <TeamPosition team={team} opponent={opponent} />
          {team.getDivisionDescription()}
          <TeamRankingBadges team={team} opponent={opponent} style={{/*reset fontSize*/}} />
        </small>
      </h1>
    );
  }
}

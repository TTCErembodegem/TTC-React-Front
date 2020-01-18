import React, {Component} from 'react';
import PropTypes, {connect, storeUtil, withRouter} from '../PropTypes.js';

import {BackIcon} from '../controls.js';
import {getOpponentMatches} from '../../actions/matchActions.js';
import {OpponentMatches} from '../matches/Match/OpponentMatches.js';
import OpponentsFormation from '../matches/Match/OpponentsFormation.js';
import {OpponentsTeamFormation} from '../matches/Match/OpponentsTeamFormation.js';
import {DivisionHeader} from '../teams/controls/DivisionHeader.js';
import {getOpponentMatchesForTeam} from '../../storeUtil';

class OpponentOverviewComponent extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    readonlyMatches: PropTypes.MatchModelList.isRequired,
    getOpponentMatches: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
        clubId: PropTypes.string.isRequired,
        teamCode: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this._escIsBack = this._escIsBack.bind(this);
  }

  _getQueryStringValues() {
    const {competition, teamCode} = this.props.match.params;
    const clubId = parseInt(this.props.match.params.clubId, 10);
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
      this.props.history.goBack();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const opponent = this._getQueryStringValues(); // do I dare say hack?
    this.props.getOpponentMatches(this._getTeam().id, opponent);
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
    const otherMatches = getOpponentMatchesForTeam(competition, clubId, teamCode);

    if (!team || !opponentClub || otherMatches.size === 0) {
      return null;
    }

    const opponent = {clubId, teamCode};
    return (
      <div style={{marginBottom: 30}}>
        <BackIcon className="pull-right" />
        <h1>
          <span>
            {opponentClub.name}: {team.competition} {opponent.teamCode}
          </span>
          <br />
          <small><DivisionHeader team={team} opponent={opponent} /></small>
        </h1>

        <div className="col-md-4">
          <h3>{t('match.tabs.opponentsFormationTitle')}</h3>
          <OpponentsTeamFormation matches={otherMatches} opponent={opponent} />
        </div>

        <div className="col-md-8">
          <h3>{t('teamCalendar.individual')}</h3>
          <OpponentsFormation match={otherMatches.first()} opponent={opponent} />
        </div>

        <h3>{t('teamCalendar.matches')}</h3>
        <OpponentMatches team={team} readonlyMatches={otherMatches} roundSwitchButton opponent={opponent} />
      </div>
    );
  }
}

export const OpponentOverview = withRouter(connect(state => ({
  matches: state.matches,
  readonlyMatches: state.readonlyMatches,
  teams: state.teams,
}), {getOpponentMatches})(OpponentOverviewComponent));

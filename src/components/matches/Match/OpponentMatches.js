import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';
import cn from 'classnames';

import Table from 'react-bootstrap/lib/Table';
import {Spinner, TrophyIcon} from '../../controls.js';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults.js';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings.js';
import {OtherMatchTeamTitle} from './OtherMatchTeamTitle.js';
import {OpponentMatchScore} from './OpponentMatchScore.js';
import {SwitchBetweenFirstAndLastRoundButton, getFirstOrLastMatches, getFirstOrLast} from '../../teams/SwitchBetweenFirstAndLastRoundButton.js';

@withViewport
export class OpponentMatches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    readonlyMatches: PropTypes.object.isRequired,
    team: PropTypes.TeamModel.isRequired,
    viewport: PropTypes.viewport,
    roundSwitchButton: PropTypes.bool,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {matchesFilter: getFirstOrLast()};
  }

  render() {
    const widthShortDate = this.props.viewport.width < 770;
    const widthWithDate = this.props.viewport.width > 500;
    const widthWithFormation = this.props.viewport.width > 770;

    const {matches} = getFirstOrLastMatches(this.props.readonlyMatches, this.state.matchesFilter);
    if (matches.size === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            {widthWithDate ? <th key="1">{this.context.t('common.date')}</th> : null}
            <th key="2">{this.context.t('match.opponents.homeTeam')}</th>
            {widthWithFormation ? <th key="3">{this.context.t('common.teamFormation')}</th> : null}
            <th key="4">{this.context.t('match.opponents.awayTeam')}</th>
            {widthWithFormation ? <th key="5">{this.context.t('common.teamFormation')}</th> : null}
            <th key="6">{widthWithDate ? this.context.t('match.opponents.outcome') : null}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            const opponent = this.props.opponent;
            const isTheirHomeMatch = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
            return [
              <tr
                key={match.id}
                className={cn({clickable: match.isSyncedWithFrenoy, 'accentuate success': match.isOurMatch})}
                onClick={() => this.setState({[match.id]: !this.state[match.id]})}
              >
                {widthWithDate ? (
                  <td key="1">
                    {match.getDisplayDate(widthShortDate ? 's' : 'd')}
                  </td>
                ) : null}

                <td key="2">
                  <OpponentTeamTitle team={this.props.team} readonlyMatch={match} isHome={true} isMarked={isTheirHomeMatch} />
                </td>
                {widthWithFormation ? (
                  <td key="3" style={{fontWeight: isTheirHomeMatch ? 'bold' : undefined}}>
                    <MatchPlayerRankings match={match} homeTeam={true} />
                  </td>
                ) : null}


                <td key="4">
                  <OpponentTeamTitle team={this.props.team} readonlyMatch={match} isHome={false} isMarked={!isTheirHomeMatch} />
                </td>
                {widthWithFormation ? (
                  <td key="5" style={{fontWeight: !isTheirHomeMatch ? 'bold' : undefined}}>
                    <MatchPlayerRankings match={match} homeTeam={false} />
                  </td>
                ) : null}


                <td key="6">
                  <OpponentMatchScore readonlyMatch={match} />
                </td>
              </tr>,
              <OtherMatchPlayerResultsTableRow show={match.isSyncedWithFrenoy && this.state[match.id]} match={match} colSpan={6} />
            ];
          })}
        </tbody>
        {this.props.roundSwitchButton ? (
          <tfoot>
            <tr>
              <td colSpan={6}>
                <SwitchBetweenFirstAndLastRoundButton
                  setState={::this.setState}
                  matchesFilter={this.state.matchesFilter}
                  t={this.context.t}
                />
              </td>
            </tr>
          </tfoot>
        ) : null}
      </Table>
    );
  }
}



@withViewport
class OpponentTeamTitle extends Component {
  static propTypes = {
    viewport: PropTypes.viewport,
    team: PropTypes.TeamModel.isRequired,
    readonlyMatch: PropTypes.MatchModel.isRequired,
    isHome: PropTypes.bool.isRequired,
    isMarked: PropTypes.bool.isRequired,
  };

  render() {
    const {team, readonlyMatch, isHome, viewport, isMarked} = this.props;
    const otherMatchTeamTitle = (
      <div style={{fontWeight: isMarked ? 'bold' : undefined, display: 'inline'}}>
        <OtherMatchTeamTitle
          team={team}
          readonlyMatch={readonlyMatch}
          isHome={isHome}
          withPosition={viewport.width > 500 && !isMarked}
        />
      </div>
    );

    if (readonlyMatch.isOurMatch || viewport.width < 400) {
      return otherMatchTeamTitle;
    }
    return (
      <div>
        {otherMatchTeamTitle}
        {isHome && readonlyMatch.scoreType === 'Lost' ? <TrophyIcon style={{marginLeft: 10}} /> : null}
        {!isHome && readonlyMatch.scoreType === 'Won' ? <TrophyIcon style={{marginLeft: 10}} /> : null}
      </div>
    );
  }
}

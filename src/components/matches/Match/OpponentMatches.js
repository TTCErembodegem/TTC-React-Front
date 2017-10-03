import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';
import cn from 'classnames';
import {OwnClubId} from '../../../models/ClubModel.js';
import {Link, browserHistory} from 'react-router';

import Table from 'react-bootstrap/lib/Table';
import IconButton from 'material-ui/IconButton';
import OpponentPlayer from './OpponentPlayer.js';
import {Spinner} from '../../controls.js';
import MatchScore from '../MatchScore.js';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults.js';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings.js';
import {OtherMatchTeamTitle} from './OtherMatchTeamTitle.js';

@withViewport
export class OpponentMatches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    readonlyMatches: PropTypes.object.isRequired,
    team: PropTypes.TeamModel.isRequired,
    viewport: PropTypes.viewport,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const widthRemoveColumn = 500;

    var matches = this.props.readonlyMatches;
    if (matches.size === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }


    return (
      <div>
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th key="1">{this.context.t('common.date')}</th>
            <th key="2">{this.context.t('match.opponents.homeTeam')}</th>
            <th key="3">{this.context.t('common.teamFormation')}</th>
            <th key="4">{this.context.t('match.opponents.awayTeam')}</th>
            <th key="5">{this.context.t('common.teamFormation')}</th>
            <th key="6">{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            const matchScore = match.isSyncedWithFrenoy ? `${match.score.home} - ${match.score.out}` : '';
            return [
              <tr
                key={match.id}
                className={cn({clickable: match.isSyncedWithFrenoy, 'accentuate success': match.home.clubId === OwnClubId || match.away.clubId === OwnClubId})}
                onClick={() => this.setState({[match.id]: !this.state[match.id]})}
              >
                <td key="1">{match.getDisplayDate(this.props.viewport.width > widthRemoveColumn ? 'd' : 's')}</td>
                <td key="2"><OtherMatchTeamTitle team={this.props.team} readonlyMatch={match} isHome={true} /></td>
                <td key="3"><MatchPlayerRankings match={match} homeTeam={true} /></td>
                <td key="4"><OtherMatchTeamTitle team={this.props.team} readonlyMatch={match} isHome={false} /></td>
                <td key="5"><MatchPlayerRankings match={match} homeTeam={false} /></td>
                <td key="6">{matchScore}</td>
              </tr>,
              <OtherMatchPlayerResultsTableRow show={match.isSyncedWithFrenoy && this.state[match.id]} match={match} colSpan={6} />
            ];
          })}
        </tbody>
      </Table>
      </div>
    );
  }
}

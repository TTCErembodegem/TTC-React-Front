import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';
import cn from 'classnames';
import {Link, browserHistory} from 'react-router';

import Table from 'react-bootstrap/lib/Table';
import IconButton from 'material-ui/IconButton';
import OpponentPlayer from './OpponentPlayer.js';
import {Spinner, TrophyIcon} from '../../controls.js';
import MatchScore from '../MatchScore.js';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults.js';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings.js';
import {OtherMatchTeamTitle} from './OtherMatchTeamTitle.js';
import {OpponentMatchScore} from './OpponentMatchScore.js';

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
    const widthShortDate = this.props.viewport.width < 770;
    const widthWithDate = this.props.viewport.width > 500;
    const widthWithFormation = this.props.viewport.width > 770;

    var matches = this.props.readonlyMatches;
    if (matches.size === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return (
      <div>
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            {widthWithDate ? <th key="1">{this.context.t('common.date')}</th> : null}
            <th key="2">{this.context.t('match.opponents.homeTeam')}</th>
            {widthWithFormation ? <th key="3">{this.context.t('common.teamFormation')}</th> : null}
            <th key="4">{this.context.t('match.opponents.awayTeam')}</th>
            {widthWithFormation ? <th key="5">{this.context.t('common.teamFormation')}</th> : null}
            <th key="6">{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            return [
              <tr
                key={match.id}
                className={cn({clickable: match.isSyncedWithFrenoy, 'accentuate success': match.isOurMatch})}
                onClick={() => this.setState({[match.id]: !this.state[match.id]})}
              >
                {widthWithDate ? <td key="1">{match.getDisplayDate(widthShortDate ? 's' : 'd')}</td> : null}
                <td key="2"><OpponentTeamTitle team={this.props.team} readonlyMatch={match} isHome={true} /></td>
                {widthWithFormation ? <td key="3"><MatchPlayerRankings match={match} homeTeam={true} /></td> : null}
                <td key="4"><OpponentTeamTitle team={this.props.team} readonlyMatch={match} isHome={false} /></td>
                {widthWithFormation ? <td key="5"><MatchPlayerRankings match={match} homeTeam={false} /></td> : null}
                <td key="6"><OpponentMatchScore readonlyMatch={match} /></td>
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

const OpponentTeamTitle = ({team, readonlyMatch, isHome}) => {
  const otherMatchTeamTitle = <OtherMatchTeamTitle team={team} readonlyMatch={readonlyMatch} isHome={isHome} />;
  if (readonlyMatch.isOurMatch) {
    return otherMatchTeamTitle;
  }
  return (
    <div>
      {otherMatchTeamTitle}
      {isHome && readonlyMatch.scoreType === 'Lost' ? <TrophyIcon style={{marginLeft: 10}} /> : null}
      {!isHome && readonlyMatch.scoreType === 'Won' ? <TrophyIcon style={{marginLeft: 10}} /> : null}
    </div>
  );
};

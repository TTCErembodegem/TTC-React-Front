import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import IconButton from '@material-ui/core/IconButton';
import PropTypes, {withViewport} from '../../PropTypes';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings';
import { Spinner } from '../../controls/controls/Spinner';

const AmountOfOpponentMatchesToShow = 5;

class OpponentsLastMatches extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string.isRequired,
    }),
    readonlyMatches: PropTypes.object.isRequired,
    viewport: PropTypes.viewport,
  }

  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
  }

  render() {
    const widthRemoveColumn = 500; // combine Home&Away columns to just one Opponent column on small devices

    let matches = this.props.readonlyMatches;
    if (!this.state.showAll) {
      matches = matches.take(AmountOfOpponentMatchesToShow);
    }
    if (matches.size === 0) {
      // TODO: Do not show spinner if these guys just haven't played any matches yet...
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th key="1">{this.context.t('common.date')}</th>
            <th key="7" className="hidden-xs">{this.context.t('common.frenoy')}</th>
            {this.props.viewport.width > widthRemoveColumn ? [
              <th key="2">{this.context.t('match.opponents.homeTeam')}</th>,
              <th key="3">{this.context.t('match.opponents.awayTeam')}</th>,
            ] : (
              <th key="4">{this.context.t('match.opponents.vsTeam')}</th>
            )}
            <th key="5">{this.context.t('common.teamFormation')}</th>
            <th key="6">{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            const {opponent} = this.props;
            const isHomeMatch = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
            return [
              <tr
                key={match.id}
                className={`clickable ${match.won(opponent) ? 'accentuate success' : ''}`}
                onClick={() => this.setState({[match.id]: !this.state[match.id]})}
              >

                <td key="1">{match.getDisplayDate(this.props.viewport.width > widthRemoveColumn ? 'd' : 's')}</td>
                <td key="7" className="hidden-xs">{match.frenoyMatchId}</td>
                {this.props.viewport.width > widthRemoveColumn ? [
                  <td key="2">{match.getClub('home').name} {match.home.teamCode}</td>,
                  <td key="3">{match.getClub('away').name} {match.away.teamCode}</td>,
                ] : (
                  <td key="4">
                    {isHomeMatch ? (
                      `${match.getClub('away').name} ${match.away.teamCode}`
                    ) : (
                      `${match.getClub('home').name} ${match.home.teamCode}`
                    )}
                  </td>
                )}

                <td key="5"><MatchPlayerRankings match={match} homeTeam={isHomeMatch} /></td>

                <td key="6">{match.score.home}&nbsp;-&nbsp;{match.score.out}</td>
              </tr>,
              <OtherMatchPlayerResultsTableRow key="8" show={this.state[match.id]} match={match} colSpan={5} />,
            ];
          })}
          {!this.state.showAll && this.props.readonlyMatches.size > AmountOfOpponentMatchesToShow ? (
            <tr key="showAll">
              <td colSpan={5} style={{textAlign: 'center'}}>
                <IconButton onClick={() => this.setState({showAll: true})}>
                  <i className="fa fa-chevron-circle-down" />
                </IconButton>
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
    );
  }
}

export default withViewport(OpponentsLastMatches);

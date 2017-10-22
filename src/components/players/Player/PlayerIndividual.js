import React, {Component} from 'react';
import PropTypes, {connect, withViewport} from '../../PropTypes.js';

import Table from 'react-bootstrap/lib/Table';
import {ThumbsUpIcon, ThumbsDownIcon} from '../../controls.js';
import {getPlayerStats} from '../../../models/TeamModel.js';

@withViewport
@connect(state => ({matches: state.matches, teams: state.teams}))
export class PlayerIndividual extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    matches: PropTypes.MatchModelList.isRequired,
    player: PropTypes.PlayerModel.isRequired,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  }

  render() {
    const {player, competition} = this.props;
    const comp = player.getCompetition(competition);
    if (!comp) {
      return null;
    }

    const matchesWithPlayer = this.props.matches
      .filter(match => match.isSyncedWithFrenoy && match.competition === competition)
      .filter(match => match.games.some(game => game.homePlayerUniqueIndex === comp.uniqueIndex || game.outPlayerUniqueIndex === comp.uniqueIndex));


    const playerResults = getPlayerStats(matchesWithPlayer)
      .find(stats => stats.ply.id === player.id);

    if (!playerResults) {
      return null;
    }

    const playedAgainst = Object.keys(playerResults.lost).concat(Object.keys(playerResults.won)).concat([comp.ranking])
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b));

    const total = {
      won: playerResults.victories,
      lost: playerResults.games - playerResults.victories,
      total: playerResults.games,
    };

    const t = this.context.t;
    return (
      <Table condensed striped style={{maxWidth: 200}}>
        <thead>
          <tr>
            <th colSpan={2}>{t('match.opponents.victories')}</th>
            <th style={{width: 30, textAlign: 'right'}}>%</th>
          </tr>
        </thead>
        <tbody>
          {playedAgainst.map(ranking => {
            const won = playerResults.won[ranking] || 0;
            const lost = playerResults.lost[ranking] || 0;

            return (
              <tr key={ranking} className={comp.ranking === ranking ? 'accentuate' : undefined}>
                <td>{ranking}</td>
                <td>
                  <WonLost won={won} lost={lost} />
                </td>
                <td><PercentageLabel won={won} lost={lost} /></td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="accentuate">
            <td>{total.total}</td>
            <td><WonLost won={total.won} lost={total.lost} /></td>
            <td><PercentageLabel won={total.won} lost={total.lost} decimals={2} /></td>
          </tr>
        </tfoot>
      </Table>
    );
  }
}

const WonLost = ({won, lost}) => ( // eslint-disable-line
  <div>
    <ThumbsUpIcon style={{marginLeft: 10}} />
    {won}

    {lost ? <ThumbsDownIcon style={{marginLeft: 8}} /> : null}
    {lost || ''}
  </div>
);

const PercentageLabel = ({won, lost, decimals = 0}) => { // eslint-disable-line
  if (!won && !lost) {
    return null;
  }
  return (
    <div className="pull-right">
      {(won / (lost + won) * 100).toFixed(decimals) + '%'}
    </div>
  );
};

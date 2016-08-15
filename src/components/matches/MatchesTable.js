import React, { Component } from 'react';
import PropTypes, { connect, withViewport } from '../PropTypes.js';
import { browserHistory } from 'react-router';

//import { selectPlayer } from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../controls/Icon.js';
import MatchVs from './Match/MatchVs.js';

function getPlayingStatusButtonClass(playingStatus) {
  switch (playingStatus) {
  case 'Play':
    return 'success';
  case 'NotPlay':
    return 'danger';
  case 'Maybe':
    return 'info';
  default:
    return null;
  }
}

@withViewport
export default class MatchesTable extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    allowOpponentOnly: PropTypes.bool,
    viewport: PropTypes.viewport,
    //selectPlayer: PropTypes.func.isRequired,
  }
  static defaultProps = {
    allowOpponentOnly: false
  }

  _renderMatchPlayers(match) {
    return (
      <ButtonToolbar>
        {match.getOwnPlayerModels('All').map(player => {
          const matchPlayer = match.players.find(x => x.playerId === player.id);
          return (
            <Button
              bsStyle={getPlayingStatusButtonClass(matchPlayer.status)}
              key={player.id}
              style={{marginBottom: 5}}>
              {player.alias}
            </Button>
          );
        })}
      </ButtonToolbar>
    );
  }

  render() {
    const t = this.context.t;
    const matchRows = [];

    this.props.matches.forEach((match, i) => {
      const stripeColor = {backgroundColor: i % 2 === 0 ? '#f9f9f9' : undefined};
      const displayVictoryIcon = match.scoreType === 'Won';
      const score = match.renderScore();

      var thrillerIcon;
      const team = match.getTeam();
      if (team.getThriller(match)) {
        thrillerIcon = (
          <Icon
            fa="fa fa-heartbeat faa-pulse animated"
            style={{marginLeft: 3, marginRight: 7, marginTop: 3, color: 'red'}} />
        );
      }

      matchRows.push(
        <tr key={match.id} style={stripeColor}>
          <td>
            {displayVictoryIcon ? <Icon fa="fa fa-trophy" color="#FCB514" style={{marginRight: 5}} /> : null}
            {thrillerIcon}
            {t('match.date', match.getDisplayDate())}
          </td>
          <td className="hidden-xs">{match.frenoyMatchId}</td>
          <td><MatchVs match={match} opponentOnly={this.props.allowOpponentOnly && this.props.viewport.width < 450} /></td>
          <td>
            <button className="btn btn-default" onClick={() => browserHistory.push(t.route('match', {matchId: match.id}))}>
              {score || t('match.details')}
            </button>
          </td>
        </tr>
      );

      if (match.players.size) {
        matchRows.push(
          <tr key={match.id + '_b'} style={stripeColor}>
            <td colSpan={4} style={{border: 'none'}}>
              {this._renderMatchPlayers(match)}
            </td>
          </tr>
        );
      }
    });

    return (
      <Table condensed>
        <thead>
          <tr>
            <th>{t('common.date')}</th>
            <th className="hidden-xs">{t('common.frenoy')}</th>
            <th>{t('teamCalendar.match')}</th>
            <th>{t('teamCalendar.score')}</th>
          </tr>
        </thead>
        <tbody>
          {matchRows}
        </tbody>
      </Table>
    );
  }
}
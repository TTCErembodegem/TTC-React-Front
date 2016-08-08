import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';
import { util as storeUtil } from '../../store.js';
import _ from 'lodash';
import moment from 'moment';

import { displayFormat } from '../controls/Telephone.js';
//import { selectPlayer } from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../controls/Icon.js';

@connect(state => ({matches: state.matches})/*, {selectPlayer}*/)
export default class MatchesWeek extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    matches: PropTypes.object.isRequired,
    //selectPlayer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentWeek: 1,
      lastWeek: 22,
    };
  }

  componentWillReceiveProps(props) {
    const today = moment();
    const sortedMatches = props.matches.sort((a, b) => a.date - b.date);
    const currentWeekMatch = sortedMatches.find(x => x.date > today);
    const lastWeekMatch = sortedMatches.last();
    const lastWeek = lastWeekMatch ? lastWeekMatch.week : 22;
    this.setState({
      currentWeek: currentWeekMatch ? currentWeekMatch.week : lastWeek,
      lastWeek: lastWeek,
    });
  }

  _onChangePlaying(match, status) {
    this.props.selectPlayer(match.id, this.props.user.playerId, status);
  }

  _getPlayingStatusButtonClass(playingStatus) {
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

  _onChangeWeek(weekDiff) {
    this.setState({currentWeek: this.state.currentWeek + weekDiff});
  }

  render() {
    if (!this.props.matches.size) {
      return null;
    }
    const t = this.context.t;

    const matches = this.props.matches.filter(match => match.week === this.state.currentWeek);
    const selectedWeek = matches.first().date.clone();
    return (
      <div>
        <h2>
          {this.state.currentWeek > 1 ? (
            <Icon fa="fa fa-arrow-left" style={{marginRight: 10}} onClick={::this._onChangeWeek.bind(this, -1)} />
          ) : null}
          {t('match.week')}&nbsp;
          {this.state.currentWeek}
          :&nbsp;
          {selectedWeek.startOf('week').format('D/M')}
          &nbsp;-&nbsp;
          {selectedWeek.endOf('week').format('D/M')}
          {this.state.currentWeek < this.state.lastWeek ? (
            <Icon fa="fa fa-arrow-right" style={{marginLeft: 10}} onClick={::this._onChangeWeek.bind(this, 1)} />
          ) : null}
        </h2>
        <h3>Vttl</h3>
        {this._renderMatchRows(matches.filter(x => x.competition === 'Vttl'))}

        <h3>Sporta</h3>
        {this._renderMatchRows(matches.filter(x => x.competition === 'Sporta'))}
      </div>
    );
  }

  _renderMatchRows(matches) {
    const t = this.context.t;

    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{t('common.frenoy')}</th>
            <th>{t('teamCalendar.date')}</th>
            <th>{t('teamCalendar.match')}</th>
            <th>{t('common.teamFormation')}</th>
          </tr>
        </thead>
        <tbody>
        {matches.sort((a, b) => a.date - b.date).map(match => {
          const us = match.getTeam().renderOwnTeamTitle();
          const them = match.renderOpponentTitle();
          const separator = <Icon fa="fa fa-arrows-h" />;
          return (
            <tr key={match.id}>
              <td>{match.frenoyMatchId}</td>
              <td>{t('match.date', match.getDisplayDate())}</td>
              {match.isHomeMatch ?
                <td><strong>{us}</strong> {separator} {them}</td>
              : <td>{them} {separator} <strong>{us}</strong></td>}
              <td>
                <ButtonToolbar>
                  {match.players.map(player => {
                    return (
                      <Button bsStyle={this._getPlayingStatusButtonClass(player.status)} key={player.playerId}>
                        {player.name}
                      </Button>
                    );
                  })}
                </ButtonToolbar>
              </td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';
import _ from 'lodash';
import moment from 'moment';

import { displayFormat } from '../controls/Telephone.js';
import { selectPlayer } from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../controls/Icon.js';

@connect(state => ({matches: state.matches}), {selectPlayer})
export default class PlayerLinup extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    matches: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  _onChangePlaying(match, status) {
    this.props.selectPlayer(match.id, this.props.user.playerId, status);
  }

  _getPlayingStatusRowClass(playing) {
    if (!playing) {
      return '';
    }
    switch (playing.status) {
    case 'Play':
      return 'success';
    case 'NotPlay':
      return 'danger';
    case 'Maybe':
      return 'info';
    default:
      return '';
    }
  }

  render() {
    const t = this.context.t;

    const teams = this.props.user.getTeams();
    const allMatchesToCome = teams.map(team => team.getMatches().toArray());
    const matches = _.uniqBy(_.flatten(allMatchesToCome), value => value.date.format('YYYYMMDD'))
      .filter(match => moment().isBefore(match.date))
      .sort((a, b) => a.date - b.date);

    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th className="hidden-xs">{t('common.frenoy')}</th>
            <th className="hidden-xs">{t('common.date')}</th>
            <th>{t('teamCalendar.match')}</th>
            <th>{t('profile.play.tableTitle')}</th>
          </tr>
        </thead>
        <tbody>
        {matches.map(match => {
          const getOnChangePlaying = status => this._onChangePlaying.bind(this, match, status);
          const buttons = (
            <ButtonToolbar>
              <Button style={{marginBottom: 5, width: 90}} bsStyle="success" onClick={getOnChangePlaying('Play')}>{t('profile.play.canPlay')}</Button>
              <Button style={{marginBottom: 5, width: 90}} bsStyle="danger" onClick={getOnChangePlaying('NotPlay')}>{t('profile.play.canNotPlay')}</Button>
              <Button style={{marginBottom: 5, width: 90}} bsStyle="info" onClick={getOnChangePlaying('Maybe')}>{t('profile.play.canMaybe')}</Button>
              <Button style={{width: 90}} onClick={getOnChangePlaying('DontKnow')}>{t('profile.play.canDontKnow')}</Button>
            </ButtonToolbar>
          );
          const currentStatus = match.plays(this.props.user.playerId);

          const us = match.getTeam().renderOwnTeamTitle();
          const them = match.renderOpponentTitle();
          const separator = <Icon fa="fa fa-arrows-h" />;
          return (
            <tr key={match.id} className={this._getPlayingStatusRowClass(currentStatus)}>
              <td className="hidden-xs">{match.frenoyMatchId}</td>
              <td className="hidden-xs">{t('match.date', match.getDisplayDate())}</td>
              <td>
                <span className="visible-xs">
                  {t('match.date', match.getDisplayDate())}
                  <br />
                </span>
                {match.isHomeMatch ?
                  <span><strong>{us}</strong> {separator} {them}</span>
                : <span>{them} {separator} <strong>{us}</strong></span>
                }
              </td>
              <td style={{width: '1%'}} className="visible-xs">{buttons}</td>
              <td className="hidden-xs">{buttons}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    );
  }
}
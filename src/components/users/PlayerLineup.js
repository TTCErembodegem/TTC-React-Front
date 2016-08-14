import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import _ from 'lodash';
import moment from 'moment';
import cn from 'classnames';

import { selectPlayer } from '../../actions/matchActions.js';

import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import MatchVs from '../matches/Match/MatchVs.js';

@connect(state => ({matches: state.matches}), {selectPlayer})
export default class PlayerLinup extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {filter: null};
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

    const userTeams = this.props.user.getTeams();
    var teams = userTeams;
    if (this.state.filter) {
      teams = teams.filter(x => x.competition === this.state.filter);
    }

    const allMatchesToCome = teams.map(team => team.getMatches().toArray());
    const matches = _.uniqBy(_.flatten(allMatchesToCome), value => value.date.format('YYYYMMDD'))
      .filter(match => moment().isBefore(match.date))
      .sort((a, b) => a.date - b.date);

    const allText = t('players.all');
    const activeFilter = this.state.filter || allText;

    return (
      <div>
        {userTeams.length > 1 ? (
          <div className="btn-group" style={{padding: 5}}>
            {[allText, 'Vttl', 'Sporta'].map(button => (
              <button
                className={cn('btn', button === activeFilter ? 'btn-info' : 'btn-default')}
                key={button}
                onClick={() => this.setState({filter: button === allText ? null : button})}>
                {button}
              </button>
            ))}
          </div>
        ) : null}

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
                <Button style={{marginBottom: 5, width: 90}} bsStyle="success" onClick={getOnChangePlaying('Play')}>
                  {t('profile.play.canPlay')}
                </Button>
                <Button style={{marginBottom: 5, width: 90}} bsStyle="danger" onClick={getOnChangePlaying('NotPlay')}>
                  {t('profile.play.canNotPlay')}
                </Button>
                <Button style={{marginBottom: 5, width: 90}} bsStyle="info" onClick={getOnChangePlaying('Maybe')}>
                  {t('profile.play.canMaybe')}
                </Button>
                <Button style={{width: 90}} onClick={getOnChangePlaying('DontKnow')}>
                  {t('profile.play.canDontKnow')}
                </Button>
              </ButtonToolbar>
            );
            const currentStatus = match.plays(this.props.user.playerId);

            return (
              <tr key={match.id} className={this._getPlayingStatusRowClass(currentStatus)}>
                <td className="hidden-xs">{match.frenoyMatchId}</td>
                <td className="hidden-xs">{t('match.date', match.getDisplayDate())}</td>
                <td>
                  <span className="visible-xs">
                    {t('match.date', match.getDisplayDate())}
                    <br />
                  </span>
                  <MatchVs match={match} />
                </td>
                <td style={{width: '1%'}} className="visible-xs">{buttons}</td>
                <td className="hidden-xs">{buttons}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </div>
    );
  }
}
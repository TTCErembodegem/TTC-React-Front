import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import _ from 'lodash';
import moment from 'moment';
import cn from 'classnames';

import { selectPlayer } from '../../actions/matchActions.js';
import { getPlayingStatusClass } from '../../models/PlayerModel.js';

import TextField from 'material-ui/TextField';
import Table from 'react-bootstrap/lib/Table';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Icon from '../controls/Icon.js';
import MatchVs from '../matches/Match/MatchVs.js';
import { getFirstOrLastMatches, getFirstOrLast, SwitchBetweenFirstAndLastRoundButton } from '../teams/Teams.js';

@connect(state => ({matches: state.matches}), {selectPlayer})
export default class PlayerLinup extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    selectPlayer: PropTypes.func.isRequired,

    playerId: PropTypes.number.isRequired,
    teams: PropTypes.arrayOf(PropTypes.TeamModel.isRequired).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: null,
      showCommentId: false,
      comment: '',
      matchesFilter: getFirstOrLast(),
    };
  }

  _onChangePlaying(match, status, comment) {
    this.props.selectPlayer(match.id, status, this.state.showCommentId ? this.state.comment : (comment || ''), this.props.playerId);
    this.setState({showCommentId: false, comment: ''});
  }

  render() {
    const t = this.context.t;
    var teams = this.props.teams;
    if (this.state.filter) {
      teams = teams.filter(x => x.competition === this.state.filter);
    }

    var allMatchesToCome = teams.map(team => team.getMatches().toArray());
    allMatchesToCome = _.uniqBy(_.flatten(allMatchesToCome), value => value.date.format('YYYYMMDD'))
      .filter(match => moment().isBefore(match.date))
      .sort((a, b) => a.date - b.date);

    const {matches, hasMore} = getFirstOrLastMatches(allMatchesToCome, this.state.matchesFilter);
    const allText = t('players.all');
    const activeFilter = this.state.filter || allText;

    return (
      <div>
        {this.props.teams.length > 1 ? (
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

        <Table condensed>
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
            const matchPlayer = match.plays(this.props.playerId);
            const statusNote = matchPlayer ? matchPlayer.statusNote : '';

            const getOnChangePlaying = status => this._onChangePlaying.bind(this, match, status, statusNote);
            var buttons;
            if (match.block) {
              buttons = (
                <span className="fa-stack fa-sm pull-right" style={{marginRight: 8, marginTop: 5}}>
                  <i className="fa fa-pencil-square-o fa-stack-1x"></i>
                  <i className="fa fa-ban fa-stack-2x text-danger"></i>
                </span>
              );
            } else {
              buttons = (
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
                  {this.state.showCommentId !== match.id ? (
                    <Button onClick={() => this.setState({showCommentId: match.id, comment: statusNote})} className="hidden-xs">
                      <Icon fa="fa fa-comment-o" />
                    </Button>
                  ) : null}
                </ButtonToolbar>
              );
            }

            return (
              <tr key={match.id} className={getPlayingStatusClass(matchPlayer)}>
                <td className="hidden-xs">{match.frenoyMatchId}</td>
                <td className="hidden-xs">{t('match.date', match.getDisplayDate())}</td>
                <td>
                  <span className="visible-xs">
                    {t('match.date', match.getDisplayDate())}
                    <br />
                  </span>
                  <MatchVs match={match} />

                  {this.state.showCommentId !== match.id && !match.block ? (
                    <Button onClick={() => this.setState({showCommentId: match.id, comment: matchPlayer ? matchPlayer.statusNote : ''})} className="visible-xs">
                      <Icon fa="fa fa-comment-o" />
                    </Button>
                  ) : null}
                  {this.state.showCommentId === match.id ? (
                    <div className="visible-xs" style={{marginTop: 12}}>
                      <br />
                      <br />
                      <ControlLabel>{this.context.t('profile.play.extraCommentHelp')}</ControlLabel>
                      <FormControl
                        type="text"
                        value={this.state.comment || ''}
                        placeholder={this.context.t('profile.play.extraComment')}
                        onChange={e => this.setState({comment: e.target.value})} />

                    </div>
                  ) : matchPlayer && matchPlayer.statusNote ? (
                    <div className="visible-xs">
                      <br />
                      <strong>{this.context.t('profile.play.extraComment')}</strong>
                      <br />
                      {matchPlayer.statusNote}
                    </div>
                  ) : null}
                </td>
                <td style={{width: '1%'}} className="visible-xs">{buttons}</td>
                <td className="hidden-xs">
                  {buttons}
                  {this.state.showCommentId === match.id ? (
                    <div>
                      <ControlLabel>{this.context.t('profile.play.extraCommentHelp')}</ControlLabel>
                      <FormControl
                        type="text"
                        value={this.state.comment || ''}
                        placeholder={this.context.t('profile.play.extraComment')}
                        onChange={e => this.setState({comment: e.target.value})} />

                    </div>
                  ) : matchPlayer && matchPlayer.statusNote ? (
                    <div>
                      <strong>{this.context.t('profile.play.extraComment')}</strong>
                      <br />
                      {matchPlayer.statusNote}
                    </div>
                  ) : null}
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>

        {hasMore ? (
          <SwitchBetweenFirstAndLastRoundButton setState={::this.setState} matchesFilter={this.state.matchesFilter} t={this.context.t} />
        ) : null}
      </div>
    );
  }
}
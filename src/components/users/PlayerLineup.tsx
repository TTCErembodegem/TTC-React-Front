import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';
import cn from 'classnames';
import Table from 'react-bootstrap/Table';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import ControlLabel from 'react-bootstrap/ControlLabel';
import FormControl from 'react-bootstrap/FormControl';
import {getPlayingStatusClass} from '../../models/PlayerModel';
import {selectPlayer} from '../../actions/matchActions';
import PropTypes, {connect} from '../PropTypes';
import {CommentButton} from '../controls/Buttons/CommentButton';
import MatchVs from '../matches/Match/MatchVs';
import {CannotEditMatchIcon} from '../matches/controls/CannotEditMatchIcon';
import {SwitchBetweenFirstAndLastRoundButton, getFirstOrLastMatches, getFirstOrLast} from '../teams/SwitchBetweenFirstAndLastRoundButton';

class PlayerLinup extends Component {
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
    const {t} = this.context;
    let {teams} = this.props;
    if (this.state.filter) {
      teams = teams.filter(x => x.competition === this.state.filter);
    }

    let allMatchesToCome = teams.map(team => team.getMatches().toArray());
    // allMatchesToCome = _.uniqBy(_.flatten(allMatchesToCome), value => value.date.format('YYYYMMDD'))
    allMatchesToCome = _.flatten(allMatchesToCome)
      .filter(match => moment().isBefore(match.date))
      .sort((a, b) => a.date - b.date);

    const {matches, hasMore} = getFirstOrLastMatches(allMatchesToCome, this.state.matchesFilter);
    const allText = t('common.all');
    const activeFilter = this.state.filter || allText;

    return (
      <div>
        {this.props.teams.length > 1 ? (
          <div className="btn-group" style={{padding: 5}}>
            {[allText, 'Vttl', 'Sporta'].map(button => (
              <button
                className={cn('btn', button === activeFilter ? 'btn-info' : 'btn-default')}
                key={button}
                onClick={() => this.setState({filter: button === allText ? null : button})}
              >
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
              let buttons;
              if (match.block) {
                buttons = CannotEditMatchIcon;
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
                      <CommentButton onClick={() => this.setState({showCommentId: match.id, comment: statusNote})} className="hidden-xs" />
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
                      <CommentButton
                        onClick={() => this.setState({showCommentId: match.id, comment: matchPlayer ? matchPlayer.statusNote : ''})}
                        className="visible-xs"
                        style={{marginTop: 8}}
                      />
                    ) : null}
                    {this.state.showCommentId === match.id ? (
                      <div className="visible-xs" style={{marginTop: 12}}>
                        <br />
                        <br />
                        <CommentEditForm onChange={e => this.setState({comment: e.target.value})} value={this.state.comment || ''} t={t} />
                      </div>
                    ) : matchPlayer && matchPlayer.statusNote ? (
                      <div className="visible-xs">
                        <Comment matchPlayer={matchPlayer} t={t} />
                      </div>
                    ) : null}
                  </td>
                  <td style={{width: '1%'}} className="visible-xs">{buttons}</td>
                  <td className="hidden-xs">
                    {buttons}
                    {this.state.showCommentId === match.id ? (
                      <CommentEditForm onChange={e => this.setState({comment: e.target.value})} value={this.state.comment || ''} t={t} />
                    ) : matchPlayer && matchPlayer.statusNote ? (
                      <Comment matchPlayer={matchPlayer} t={t} />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {hasMore ? (
          <SwitchBetweenFirstAndLastRoundButton setState={this.setState.bind(this)} matchesFilter={this.state.matchesFilter} t={t} />
        ) : null}
      </div>
    );
  }
}

const Comment = ({matchPlayer, t}) => (
  <div>
    <strong>{t('profile.play.extraComment')}</strong>
    <br />
    {matchPlayer.statusNote}
  </div>
);

Comment.propTypes = {
  matchPlayer: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const CommentEditForm = ({onChange, value, t}) => (
  <div>
    <ControlLabel>{t('profile.play.extraCommentHelp')}</ControlLabel>
    <FormControl
      type="text"
      value={value}
      placeholder={t('profile.play.extraComment')}
      onChange={onChange}
    />
  </div>
);

CommentEditForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect(state => ({matches: state.matches}), {selectPlayer})(PlayerLinup);

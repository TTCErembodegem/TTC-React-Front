import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import { browserHistory } from 'react-router';
import moment from 'moment';
import Icon from '../controls/Icon.js';
import MatchesTable from './MatchesTable.js';

@connect(state => ({matches: state.matches, user: state.user}))
export default class MatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
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
        <h3 style={{textAlign: 'center'}}>
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
        </h3>

        {false && this.props.user.isAdmin() ? (
          <span className="pull-right">
            <button className="btn btn-default" style={{marginRight: 5}}>WEEK BLOKKEREN</button>
            <button className="btn btn-default">
              <Icon fa="fa fa-envelope-o" onClick={() => console.log('emailing opstelling...')} />
            </button>
          </span>
        ) : null}

        <h4><strong>Vttl</strong></h4>
        <MatchesTable matches={matches.filter(x => x.competition === 'Vttl').sort((a, b) => a.date - b.date)} user={this.props.user} />

        <hr />

        <h4><strong>Sporta</strong></h4>
        <MatchesTable matches={matches.filter(x => x.competition === 'Sporta').sort((a, b) => a.date - b.date)} user={this.props.user} />
      </div>
    );
  }
}
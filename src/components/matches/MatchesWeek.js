import React, { Component } from 'react';
import PropTypes, { connect, browserHistory } from '../PropTypes.js';
import moment from 'moment';
import Icon from '../controls/Icon.js';
import MatchesTable from './MatchesTable.js';
import ButtonStack from '../controls/ButtonStack.js';

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
      editMode: false,
      filter: 'all',
    };
  }

  componentWillReceiveProps(props) {
    if (!this.state.fixedWeek) {
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
  }

  _onChangeWeek(weekDiff) {
    this.setState({currentWeek: this.state.currentWeek + weekDiff, fixedWeek: true});
  }

  render() {
    if (!this.props.matches.size) {
      return null;
    }
    const t = this.context.t;

    const matches = this.props.matches.filter(match => match.week === this.state.currentWeek);
    const selectedWeek = matches.first().date.clone();

    const viewsConfig = [{
      key: 'all',
      text: this.context.t('players.all')
    }, {
      key: 'Vttl',
      text: 'Vttl'
    }, {
      key: 'Sporta',
      text: 'Sporta'
    }];

    //<button className="btn btn-default">
    //  <Icon fa="fa fa-envelope-o" onClick={() => console.log('emailing opstelling...')} />
    //</button>
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>
          <Icon fa="fa fa-arrow-left" style={{marginRight: 10, visibility: this.state.currentWeek > 1 ? '' : 'hidden'}} onClick={::this._onChangeWeek.bind(this, -1)} />
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

        <span className="pull-right">
          <ButtonStack
            config={viewsConfig}
            small={false}
            activeView={this.state.filter}
            onClick={newFilter => this.setState({filter: newFilter})} />

          {this.props.user.canManageTeams() ? (
            <button onClick={() => this.setState({editMode: !this.state.editMode})} className="btn btn-default" style={{marginLeft: 5}}>
              <Icon fa="fa fa-pencil-square-o" />
            </button>
          ) : null}
        </span>

        {this.state.filter !== 'Sporta' ? (
          <div>
            <h4><strong>Vttl</strong></h4>
            <MatchesTable editMode={this.state.editMode} matches={matches.filter(x => x.competition === 'Vttl').sort((a, b) => a.date - b.date)} user={this.props.user} />
            <hr />
          </div>
        ) : null}

        {this.state.filter !== 'Vttl' ? (
          <div>
            <h4><strong>Sporta</strong></h4>
            <MatchesTable editMode={this.state.editMode} matches={matches.filter(x => x.competition === 'Sporta').sort((a, b) => a.date - b.date)} user={this.props.user} />
          </div>
        ) : null}
      </div>
    );
  }
}
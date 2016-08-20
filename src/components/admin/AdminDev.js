import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import TabbedContainer from '../controls/TabbedContainer.js';
import Icon from '../controls/Icon.js';

const tabEventKeys = {
  matches: 1,
  teams: 2,
  clubs: 3,
  config: 4,
  user: 8,
  readOnlyMatches: 5,
  players: 7,
  admin: 6,
};


@connect(state => {
  return {
    matches: state.matches,
    teams: state.teams,
    clubs: state.clubs,
    config: state.config,
    user: state.user,
    readonlyMatches: state.readonlyMatches,
    players: state.players,
    admin: state.admin,
  };
})
export default class AdminDev extends React.Component {
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    readonlyMatches: PropTypes.MatchModelList.isRequired,
    players: PropTypes.PlayerModelList.isRequired,
    admin: PropTypes.object.isRequired,
  }

  _renderSection(eventKey) {
    switch (eventKey) {
    case tabEventKeys.matches:
      return <AdminStateDisplayer data={this.props.matches.toArray()} />;
    case tabEventKeys.teams:
      return <AdminStateDisplayer data={this.props.teams.toArray()} />;
    case tabEventKeys.clubs:
      return <AdminStateDisplayer data={this.props.clubs.toArray()} />;
    case tabEventKeys.config:
      return <AdminStateDisplayer data={[this.props.config.toJSON()]} />;
    case tabEventKeys.user:
      return <AdminStateDisplayer data={[this.props.user]} />;
    case tabEventKeys.readOnlyMatches:
      return <AdminStateDisplayer data={this.props.readonlyMatches.toArray()} />;
    case tabEventKeys.players:
      return <AdminStateDisplayer data={this.props.players.toArray()} />;
    case tabEventKeys.admin:
      // admin.players === inactive players
      return <AdminStateDisplayer data={this.props.admin.players.toArray()} />;
    }
  }

  render() {
    const tabConfig = [{
      key: tabEventKeys.matches,
      title: 'Matches'
    }, {
      key: tabEventKeys.teams,
      title: 'Teams'
    }, {
      key: tabEventKeys.clubs,
      title: 'Clubs'
    }, {
      key: tabEventKeys.config,
      title: 'Config'
    }, {
      key: tabEventKeys.user,
      title: 'User'
    }, {
      key: tabEventKeys.readOnlyMatches,
      title: 'ReadOnlyMatches'
    }, {
      key: tabEventKeys.players,
      title: 'Spelers'
    }, {
      key: tabEventKeys.admin,
      title: 'Admin'
    }];

    return (
      <div style={{padding: 5}}>
        <TabbedContainer
          style={{marginTop: 10, marginBottom: 20}}
          openTabKey={tabEventKeys.matches}
          tabKeys={tabConfig}
          tabRenderer={::this._renderSection} />
      </div>
    );
  }
}

class AdminStateDisplayer extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {filter: ''}
  }

  render() {
    var data = this.props.data;

    if (this.state.filter)
    {
      data = data.filter(x => {
        for (var name in x) {
          if (x[name] == this.state.filter) {
              return true;
          };
        }
      });
    }

    return (
      <div style={{padding: 5}}>
        <a href="http://ttc-tst-webapp.azurewebsites.net/">Test site</a>
        <div>
          <Icon fa="fa fa-search" />
          &nbsp;
          <input type="text" width={150} onChange={e => this.setState({filter: e.target.value})} />
        </div>
        <pre style={{marginTop: 30}}>{JSON.stringify(data, null, 4)}</pre>
      </div>
    );
  }
}
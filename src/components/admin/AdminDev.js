import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import TabbedContainer from '../controls/TabbedContainer.js';

const tabEventKeys = {
  matches: 1,
  teams: 2,
  clubs: 3,
  config: 4,
  readOnlyMatches: 5
};

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
    admin: state.admin,
  };
})

export default class AdminDev extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired
  }

  _renderSection(eventKey) {
    switch (eventKey) {
    case tabEventKeys.matches:
      return (
        <div>
          {console.log(this)}
          <pre>
            {JSON.stringify(this, null, 4)}
          </pre>
        </div>
      );
    case tabEventKeys.teams:
      return;
    case tabEventKeys.clubs:
      return;
    case tabEventKeys.config:
      return;
    case tabEventKeys.readOnlyMatches:
      return;
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
      key: tabEventKeys.readOnlyMatches,
      title: 'ReadOnlyMatches'
    }];

    return (
      <TabbedContainer
        style={{marginTop: 10, marginBottom: 20}}
        openTabKey={tabEventKeys.matches}
        tabKeys={tabConfig}
        tabRenderer={this._renderSection} />
    );
  }
}
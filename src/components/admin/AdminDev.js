import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import {List, Map} from 'immutable';
import _ from 'lodash';

import {ButtonStack, Icon} from '../controls.js';

@connect(state => state)
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

  constructor() {
    super();
    this.state = {filter: 'matches'};
  }

  _renderSection(eventKey) {
    var data = this.props[eventKey];
    if (eventKey === 'admin') {
      data = data.players; // admin.players === inactive players
    }
    if (List.isList(data)) {
      return <AdminStateDisplayer data={data.toArray()} />;
    } else if (Map.isMap(data)) {
      return <AdminStateDisplayer data={data.toJSON()} />;
    } else {
      return <AdminStateDisplayer data={data} />;
    }
  }

  render() {
    var viewsConfig = [];
    _.forOwn(this.props, (value, key) => {
      if (key !== 'dispatch') {
        viewsConfig.push({
          key: key,
          text: key
        });
      }
    });

    return (
      <div style={{padding: 5}}>
        <div className="pull-right">
          <a href="http://ttc-tst-webapp.azurewebsites.net/">Goto test site</a>
          <br />
          <a href="http://ttc-erembodegem.be/tabtapi-test/" target="_blank">Goto TabT test site</a>
          <br />
          <a href="http://ttc-erembodegem.be/api/config/log/Get" target="_blank">Goto log dump</a>
        </div>
        <ButtonStack
          config={viewsConfig}
          small={false}
          activeView={this.state.filter}
          onClick={newFilter => this.setState({filter: newFilter})}
        />

        {this._renderSection(this.state.filter)}
      </div>
    );
  }
}

class AdminStateDisplayer extends Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {filter: ''};
  }

  render() {
    var data = this.props.data;
    if (this.state.filter) {
      if (_.isArray(data)) {
        data = data.filter(entry => {
          for (let key in entry) {
            if (typeof entry[key] === 'string') {
              if (entry[key].toLowerCase().indexOf(this.state.filter) !== -1) {
                return true;
              }
            }
            if (entry[key] === this.state.filter) {
              return true;
            }
          }
        });
      }
    }

    return (
      <div style={{padding: 5}}>
        <div>
          <Icon fa="fa fa-search" />
          &nbsp;
          <input type="text" width={150} onChange={e => this.setState({filter: e.target.value.toLowerCase()})} />
          {_.isArray(this.props.data) ? <span style={{marginLeft: 10}}>Records: {data.length}</span> : null}
        </div>
        <pre style={{marginTop: 20}}>{JSON.stringify(data, null, 4)}</pre>
      </div>
    );
  }
}

import React, {Component} from 'react';
import {List, Map} from 'immutable';
import _ from 'lodash';
import PropTypes, {connect} from '../PropTypes';
import {IMatchCommon, IMatchOwn, ITeam, IClub, IMatchOther, IPlayer} from '../../models/model-interfaces';
import {IUser} from '../../models/UserModel';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { Icon } from '../controls/Icons/Icon';


type AdminDevProps = {
  matches: (IMatchCommon & IMatchOwn)[];
  teams: ITeam[];
  clubs: IClub[];
  config: any;
  user: IUser;
  readonlyMatches: (IMatchCommon & IMatchOther)[];
  players: IPlayer[];
  admin: any;
}

class AdminDev extends React.Component<AdminDevProps> {
  constructor(props) {
    super(props);
    this.state = {filter: 'matches'};
  }

  _renderSection(eventKey) {
    let data = this.props[eventKey];
    if (eventKey === 'admin') {
      data = data.players; // admin.players === inactive players
    }
    if (List.isList(data)) {
      return <AdminStateDisplayer data={data.toArray()} />;
    } if (Map.isMap(data)) {
      return <AdminStateDisplayer data={data.toJSON()} />;
    }
    return <AdminStateDisplayer data={data} />;

  }

  render() {
    const viewsConfig = [];
    _.forOwn(this.props, (value, key) => {
      if (key !== 'dispatch') {
        viewsConfig.push({
          key,
          text: key,
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
    let {data} = this.props;
    if (this.state.filter) {
      if (_.isArray(data)) {
        data = data.filter(entry => {
          for (const key in entry) {
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

export default connect(state => state)(AdminDev);

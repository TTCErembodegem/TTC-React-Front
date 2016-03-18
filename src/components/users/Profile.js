import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import PlayerModel from '../../models/PlayerModel.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

@connect(state => {
  return {
    //config: state.config,
    user: state.user,
    //players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    // teams: state.teams,
  };
}, loginActions)
export default class Login extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    // players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    // user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor() {
    super();
  }

  render() {
    const t = this.context.t;
    const paperStyle = {
      height: 310,
      width: 320,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>Profiel</h3>

        <RaisedButton label={t('nav.changePassword')}
          style={{marginTop: 15}} onClick={() => browserHistory.push(t.route('changePassword'))} />

        <br />

        <RaisedButton
          label={this.context.t('login.logoutButton')}
          secondary={true}
          style={{marginTop: 15}}
          onClick={::this._onLogout} />
      </Paper>
    );
  }
  _onLogout() {
    this.props.logout();
  }
}
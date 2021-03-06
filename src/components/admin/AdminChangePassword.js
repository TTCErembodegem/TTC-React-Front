import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import * as userActions from '../../actions/userActions.js';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';

@connect(() => ({}), userActions)
export default class AdminChangePassword extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    adminSetNewPassword: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      newPassword: null,
    };
  }
  render() {
    const paperStyle = {
      marginLeft: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('password.changeTitle')}</h3>

        <PlayerAutoComplete
          selectPlayer={playerId => this.setState({playerId})}
          placeholder={this.context.t('login.loginName')}
        />

        <br />

        <TextField
          label={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({newPassword: e.target.value})}
        />

        <br />

        <MaterialButton variant="contained"
          label={this.context.t('profile.editPassword')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => {
            this.props.adminSetNewPassword(this.state);
            this.props.onEnd();
          }}
          disabled={!this.state.playerId && !this.state.newPassword}
        />
      </div>
    );
  }
}

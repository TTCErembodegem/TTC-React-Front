import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import * as userActions from '../../actions/userActions.js';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@connect(() => ({}), userActions)
export default class AdminChangePassword extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    setNewPassword: PropTypes.func.isRequired,
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
          hintText={this.context.t('login.loginName')} />

        <br />

        <TextField
          floatingLabelText={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({newPassword: e.target.value})} />

        <br />

        <RaisedButton
          label={this.context.t('profile.editPassword')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => {
            this.props.setNewPassword(this.state);
            this.props.onEnd();
          }}
          disabled={!this.state.playerId && !this.state.newPassword} />
      </div>
    );
  }
}
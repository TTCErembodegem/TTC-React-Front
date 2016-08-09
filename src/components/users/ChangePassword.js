import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as userActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

@connect(() => ({}), userActions)
export class ChangeAnyPassword extends Component {
  static contextTypes = contextTypes;
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
      height: 280,
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{this.context.t('changePassword.title')}</h3>

        <PlayerAutoComplete
          selectPlayer={playerId => this.setState({playerId})}
          hintText={this.context.t('login.loginName')} />

        <TextField
          floatingLabelText={this.context.t('changePassword.newPassword')}
          type="password"
          onChange={e => this.setState({newPassword: e.target.value})} />

        <RaisedButton
          label={this.context.t('profile.editPassword')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => {
            this.props.setNewPassword(this.state);
            this.props.onEnd();
          }}
          disabled={!this.state.playerId && !this.state.newPassword} />
      </Paper>
    );
  }
}




@connect(state => {
  return {
    user: state.user,
  };
}, userActions)
export default class ChangePassword extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      oldpassword: null,
      newpassword: null,
    };
  }

  render() {
    const paperStyle = {
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('changePassword.title')}</h3>

        <TextField
          floatingLabelText={this.context.t('changePassword.oldPassword')}
          type="password"
          onChange={e => this.setState({oldpassword: e.target.value})} />

        <TextField
          floatingLabelText={this.context.t('changePassword.newPassword')}
          type="password"
          onChange={e => this.setState({newpassword: e.target.value})} />

        <RaisedButton
          label={this.context.t('profile.editPassword')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.changePassword(this.props.user.playerId, this.state)}
          disabled={!this.state.oldpassword && !this.state.newpassword} />

      </div>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import PlayerModel from '../../models/PlayerModel.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    // teams: state.teams,
  };
}, loginActions)
export default class ChangePassword extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    user: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    newPassword: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      oldpassword: null,
      newpassword: null,
    };
  }

  render() {
    var paperStyle = {
      height: 380,
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{this.context.t('changePassword.title')}</h3>
        <span>{this.context.t('changePassword.introText')}</span>
        <PlayerAutoComplete
          players={this.props.players}
          selectPlayer={::this._onSelectPlayer}
          floatingLabelText={this.context.t('changePassword.loginName')} />

        <TextField
          floatingLabelText={this.context.t('changePassword.oldPassword')}
          hintText={this.context.t('changePassword.oldPasswordHint')}
          type="password"
          onChange={::this._onOldPasswordChange} />

        <TextField
          floatingLabelText={this.context.t('changePassword.newPassword')}
          hintText={this.context.t('changePassword.newPasswordHint')}
          type="password"
          onChange={::this._onNewPasswordChange} />

        <RaisedButton
          label={this.context.t('changePassword.changePasswordButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={::this._onChangePassword}
          disabled={!this.state.playerId} />

        <RaisedButton
          label={this.context.t('changePassword.NewPasswordButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={::this._onNewPasswordNeeded}
          disabled={!this.state.playerId} />
      </Paper>
    );
  }
  _onSelectPlayer(id) {
    this.setState({playerId: id});
  }
  _onOldPasswordChange(e) {
    this.setState({oldpassword: e.target.value});
  }
  _onNewPasswordChange(e) {
    this.setState({newpassword: e.target.value});
  }
  _onChangePassword() {
    this.props.changePassword(this.state);
  }
  _onNewPasswordNeeded() {
    this.props.newPassword(this.state);
  }
}
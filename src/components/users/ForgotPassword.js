import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import PropTypes, {connect} from '../PropTypes.js';

import * as loginActions from '../../actions/userActions.js';
import {paperStyle} from './Login.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

@connect(() => ({}), loginActions)
export default class ForgotPassword extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    requestResetPasswordLink: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      email: null,
    };
  }

  render() {
    const t = this.context.t;
    return (
      <Paper zDepth={1} style={{...paperStyle, height: 280}}>
        <h3>{t('password.newPassword')}</h3>
        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          floatingLabelText={t('login.loginName')} />

        <TextField
          floatingLabelText={this.context.t('player.email')}
          onChange={e => this.setState({email: e.target.value})} />

        <RaisedButton
          label={t('password.sendNewButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.requestResetPasswordLink(this.state)}
          disabled={!this.state.playerId && !this.state.email} />

      </Paper>
    );
  }
}






@connect(() => ({}), loginActions)
export class ForgotPasswordReset extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    setNewPasswordFromGuid: PropTypes.func.isRequired,
    params: PropTypes.shape({
      guid: PropTypes.string.isRequired
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      guid: props.params.guid,
      playerId: null,
      password: null,
    };
  }

  render() {
    const t = this.context.t;
    return (
      <Paper zDepth={1} style={{...paperStyle, height: 210}}>
        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          floatingLabelText={t('login.loginName')} />

        <TextField
          floatingLabelText={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({password: e.target.value})} />

        <Route render={({history}) => (
          <RaisedButton
            label={t('password.changeTitle')}
            primary={true}
            style={{marginTop: 15}}
            onClick={() => this.props.setNewPasswordFromGuid(this.state).then(() => history.push('/'))}
            disabled={!this.state.playerId && !this.state.password}
          />
        )} />
      </Paper>
    );
  }
}

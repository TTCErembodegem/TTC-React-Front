import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import PropTypes, {connect} from '../PropTypes.js';

import * as loginActions from '../../actions/userActions.js';
import {paperStyle} from './Login.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';
import Paper from '@material-ui/core/Paper';

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
      <Paper style={{...paperStyle, height: 280}}>
        <h3>{t('password.newPassword')}</h3>
        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          label={t('login.loginName')}
        />

        <br />

        <TextField
          label={this.context.t('player.email')}
          onChange={e => this.setState({email: e.target.value})}
          fullWidth
        />

        <br />
        <br />

        <MaterialButton variant="contained"
          label={t('password.sendNewButton')}
          primary={true}
          style={{marginTop: 15, width: '100%'}}
          onClick={() => this.props.requestResetPasswordLink(this.state)}
          disabled={!this.state.playerId && !this.state.email}
        />

      </Paper>
    );
  }
}






@connect(() => ({}), loginActions)
export class ForgotPasswordReset extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    setNewPasswordFromGuid: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        guid: PropTypes.string.isRequired
      }),
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      guid: props.match.params.guid,
      playerId: null,
      password: null,
    };
  }

  render() {
    const t = this.context.t;
    return (
      <Paper style={{...paperStyle, height: 210}}>
        <br />
        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          label={t('login.loginName')}
        />

        <TextField
          label={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({password: e.target.value})}
          fullWidth
        />

        <Route render={({history}) => (
          <MaterialButton variant="contained"
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

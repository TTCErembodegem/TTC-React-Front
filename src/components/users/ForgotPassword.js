import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import * as loginActions from '../../actions/userActions.js';
import { paperStyle } from './Login.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

@connect(() => ({}), loginActions)
export default class ForgotPassword extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    requestNewPassword: PropTypes.func.isRequired,
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
          onClick={() => this.props.requestNewPassword(this.state)}
          disabled={!this.state.playerId && !this.state.email} />

      </Paper>
    );
  }
}
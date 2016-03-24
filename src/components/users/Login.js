import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
  };
}, loginActions)
export default class Login extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      password: null,
    };
  }

  render() {
    const t = this.context.t;
    const paperStyle = {
      height: 290,
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{t('login.title')}</h3>
        <span>{t('login.introText')}</span>
        <PlayerAutoComplete
          selectPlayer={::this._onSelectPlayer}
          floatingLabelText={t('login.loginName')} />

        <TextField
          floatingLabelText={t('login.password')}
          hintText={t('login.passwordHint')}
          type="password"
          onChange={::this._onPasswordChange} />

        <RaisedButton
          label={t('login.loginButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={::this._onLogin}
          disabled={!this.state.playerId} />
      </Paper>
    );
  }
  _onSelectPlayer(id) {
    this.setState({playerId: id});
  }
  _onPasswordChange(e) {
    this.setState({password: e.target.value});
  }
  _onLogin() {
    this.props.login(this.state);
  }
}
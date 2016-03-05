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
export default class Login extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
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
    var paperStyle = {
      height: 280,
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{this.context.t('login.title')}</h3>
        <span>{this.context.t('login.introText')}</span>
        <PlayerAutoComplete
          players={this.props.players}
          selectPlayer={::this._onSelectPlayer}
          floatingLabelText={this.context.t('login.loginName')} />

        <TextField
          floatingLabelText={this.context.t('login.password')}
          hintText={this.context.t('login.passwordHint')}
          type="password"
          onChange={::this._onPasswordChange} />

        <RaisedButton
          label={this.context.t('login.loginButton')}
          secondary={true}
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
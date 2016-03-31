import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as playerActions from '../../actions/playerActions.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

@connect(state => {
  return {
    user: state.user,
  };
}, playerActions)
export default class ChangePlayerDetails extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
    updatePlayer: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      email: null,
      gsm: null,
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
        <h3>{this.context.t('updatePlayer.title')}</h3>

        <TextField
          floatingLabelText={this.context.t('updatePlayer.email')}
          type="text"
          onChange={::this._onEmailChange} />

        <TextField
          floatingLabelText={this.context.t('updatePlayer.phoneNumber')}
          type="text"
          onChange={::this._onPhoneNumberChange} />

        <RaisedButton
          label={this.context.t('updatePlayer.changeDetailsButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={::this._onUpdatePlayer}
          disabled={!this.state.email || !this.state.gsm} />

      </Paper>
    );
  }
  _onEmailChange(e) {
    this.setState({email: e.target.value});
  }
  _onPhoneNumberChange(e) {
    this.setState({gsm: e.target.value});
  }
  _onUpdatePlayer() {
    this.props.updatePlayer(this.props.user.playerId, this.state);
  }
}
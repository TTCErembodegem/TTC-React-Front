import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as playerActions from '../../actions/playerActions.js';
import { util as storeUtil } from '../../store.js';

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
      address: null,
      city: null,
    };
  }

  componentWillMount() {
    var player = storeUtil.getPlayer(this.props.user.playerId);
    this.state = {
      email: player.contact.email,
      gsm: player.contact.mobile,
      address: player.contact.address,
      city: player.contact.city,
    };
  }

  render() {

    var player = storeUtil.getPlayer(this.props.user.playerId);

    const paperStyle = {
      height: 480,
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
          defaultValue={player.contact.email}
          onChange={::this._onEmailChange} />

        <TextField
          floatingLabelText={this.context.t('updatePlayer.phoneNumber')}
          type="text"
          defaultValue={player.contact.mobile}
          onChange={::this._onPhoneNumberChange} />

        <TextField
          floatingLabelText={this.context.t('updatePlayer.address')}
          type="text"
          defaultValue={player.contact.address}
          onChange={::this._onAddressChange} />

        <TextField
          floatingLabelText={this.context.t('updatePlayer.city')}
          type="text"
          defaultValue={player.contact.city}
          onChange={::this._onCityChange} />

        <RaisedButton
          label={this.context.t('updatePlayer.changeDetailsButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={::this._onUpdatePlayer} />

      </Paper>
    );
  }
  _onEmailChange(e) {
    this.setState({email: e.target.value});
  }
  _onPhoneNumberChange(e) {
    this.setState({gsm: e.target.value});
  }
  _onAddressChange(e) {
    this.setState({address: e.target.value});
  }
  _onCityChange(e) {
    this.setState({city: e.target.value});
  }
  _onUpdatePlayer() {
    this.props.updatePlayer(this.props.user.playerId, this.state);
  }
}
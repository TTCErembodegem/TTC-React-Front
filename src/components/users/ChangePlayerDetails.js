import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import * as playerActions from '../../actions/playerActions.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

@connect(() => ({}), playerActions)
export default class ChangePlayerDetails extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    updatePlayer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: props.player.contact.email,
      mobile: props.player.contact.mobile,
      address: props.player.contact.address,
      city: props.player.contact.city,
    };
  }

  render() {
    const player = this.props.player;
    const paperStyle = {
      width: 290,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('profile.editDetails')}</h3>

        <TextField
          floatingLabelText={this.context.t('player.email')}
          type="text"
          defaultValue={player.contact.email}
          onChange={e => this.setState({email: e.target.value})} />

        <TextField
          floatingLabelText={this.context.t('player.gsm')}
          type="text"
          defaultValue={player.contact.mobile}
          onChange={e => this.setState({mobile: e.target.value})} />

        <TextField
          floatingLabelText={this.context.t('player.address')}
          type="text"
          defaultValue={player.contact.address}
          onChange={e => this.setState({address: e.target.value})} />

        <TextField
          floatingLabelText={this.context.t('player.city')}
          type="text"
          defaultValue={player.contact.city}
          onChange={e => this.setState({city: e.target.value})} />

        <RaisedButton
          label={this.context.t('profile.editDetails')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.updatePlayer(Object.assign(this.props.player, {contact: this.state}))} />

      </div>
    );
  }
}
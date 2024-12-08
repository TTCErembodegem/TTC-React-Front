import React, {Component} from 'react';
import TextField from '@mui/material/TextField';
import PropTypes, {connect} from '../PropTypes';
import * as playerActions from '../../actions/playerActions';
import {MaterialButton} from '../controls/Buttons/MaterialButton';


class ChangePlayerDetails extends Component {
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
    const {player} = this.props;
    const paperStyle = {
      width: 290,
      margin: 0,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('profile.editDetails')}</h3>

        <TextField
          label={this.context.t('player.email')}
          defaultValue={player.contact.email}
          onChange={e => this.setState({email: e.target.value})}
        />

        <TextField
          label={this.context.t('player.gsm')}
          type="number"
          defaultValue={player.contact.mobile}
          onChange={e => this.setState({mobile: e.target.value})}
        />

        <TextField
          label={this.context.t('player.address')}
          defaultValue={player.contact.address}
          onChange={e => this.setState({address: e.target.value})}
        />

        <TextField
          label={this.context.t('player.city')}
          defaultValue={player.contact.city}
          onChange={e => this.setState({city: e.target.value})}
        />

        <MaterialButton
          variant="contained"
          label={this.context.t('profile.editDetails')}
          primary
          style={{marginTop: 15}}
          onClick={() => this.props.updatePlayer(Object.assign(this.props.player, {contact: this.state}))}
        />

      </div>
    );
  }
}

export default connect(() => ({}), playerActions)(ChangePlayerDetails);

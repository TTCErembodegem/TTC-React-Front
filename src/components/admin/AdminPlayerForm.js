import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';

import * as playerActions from '../../actions/playerActions.js';
import {userRoles} from '../../models/UserModel.js';
import PlayerModel from '../../models/PlayerModel.js';

import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';
import Paper from '@material-ui/core/Paper';
import Panel from 'react-bootstrap/lib/Panel';
import PlayerStyleAutocomplete from '../players/PlayerStyleAutocomplete.js';
import MenuItem from '@material-ui/core/MenuItem';

@connect(() => ({}), playerActions)
export default class AdminPlayerForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    player: PropTypes.PlayerModel,
    updatePlayer: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    if (!props.player) {
      this.state = new PlayerModel();
    } else {
      this.state = props.player;
    }
  }

  render() {
    const player = this.state;
    const fieldMargin = 30;
    return (
      <div style={{marginLeft: 10, marginRight: 10}}>
        <h3>{!player.firstName && !player.lastName ? 'Nieuw lid' : (player.firstName + ' ' + player.lastName)}</h3>
        <div>
          <Paper style={{padding: 15}}>
            <h4>Persoonlijk</h4>
            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('Voornaam')}
              defaultValue={player.firstName}
              onChange={e => this.setState({firstName: e.target.value})}
            />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('Achternaam')}
              defaultValue={player.lastName}
              onChange={e => this.setState({lastName: e.target.value})}
            />

            <TextField
              style={{width: 200}}
              label={this.context.t('player.alias')}
              defaultValue={player.alias}
              onChange={e => this.setState({alias: e.target.value})}
            />

            <br />
            <br />

            <div style={{maxWidth: 250, marginBottom: 7}}>
              <PlayerStyleAutocomplete t={this.context.t}
                value={player.style.name || ''}
                onChange={text => this.setState({style: Object.assign({}, player.style, {name: text})})}
              />
            </div>

            <TextField
              style={{width: 230}}
              label={this.context.t('player.editStyle.bestStroke')}
              defaultValue={player.style.bestStroke}
              onChange={e => this.setState({style: Object.assign({}, player.style, {bestStroke: e.target.value})})}
            />

            <br />
            <br />

            <PlayerSecuritySelectField value={player.security} onChange={event => this.setState({security: event.target.value})} />
          </Paper>


          <Panel style={{marginTop: 20, padding: 15}}>
            <h4>Contact</h4>
            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('player.email')}
              defaultValue={player.contact.email}
              onChange={e => this.setState({contact: Object.assign({}, player.contact, {email: e.target.value})})}
            />

            <TextField
              style={{width: 200}}
              type="number"
              label={this.context.t('player.gsm')}
              defaultValue={player.contact.mobile}
              onChange={e => this.setState({contact: Object.assign({}, player.contact, {mobile: e.target.value})})}
            />

            <br />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('player.address')}
              defaultValue={player.contact.address}
              onChange={e => this.setState({contact: Object.assign({}, player.contact, {address: e.target.value})})}
            />

            <TextField
              style={{width: 200}}
              label={this.context.t('player.city')}
              defaultValue={player.contact.city}
              onChange={e => this.setState({contact: Object.assign({}, player.contact, {city: e.target.value})})}
            />

          </Panel>
        </div>
        <MaterialButton variant="contained"
          label={this.context.t('common.save')}
          primary={true}
          style={{marginTop: 5}}
          onClick={() => {
            this.props.updatePlayer(this.state);
            this.props.onEnd();
          }}
        />

        <MaterialButton variant="contained"
          label={this.context.t('common.cancel')}
          style={{marginTop: 5, marginLeft: 10}}
          onClick={() => this.props.onEnd()}
        />
      </div>
    );
  }
}



class PlayerSecuritySelectField extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <TextField select style={{width: 100}} value={this.props.value} onChange={this.props.onChange} label="Toegang">
        {userRoles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
      </TextField>
    );
  }
}

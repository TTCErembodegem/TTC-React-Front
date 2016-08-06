import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { contextTypes } from '../../utils/decorators/withContext.js';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import PlayerModel from '../../models/PlayerModel.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import { util as storeUtil } from '../../store.js';
import { displayFormat } from '../controls/Telephone.js';


@connect(state => {
  return {
    //config: state.config,
    user: state.user,
  };
}, loginActions)
export default class Profile extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor() {
    super();
  }

  render() {
    const t = this.context.t;
    const paperStyle = {
      height: 450,
      width: 320,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    var player = storeUtil.getPlayer(this.props.user.playerId) || {contact: {}, name: 'Broken Code'};

    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{player.name}</h3>
        <p>{this.context.t('player.email')}&nbsp;{player.contact.email}</p>
        <p>{this.context.t('player.gsm')}&nbsp;{displayFormat(player.contact.mobile)}</p>
        <p>{this.context.t('player.address')}&nbsp;{player.contact.address}</p>
        <p>{this.context.t('player.city')}&nbsp;{player.contact.city}</p>

        <RaisedButton label={t('nav.profilePhotos')}
          style={{marginTop: 15}} onClick={() => browserHistory.push(t.route('profilePhotos'))} />

        <RaisedButton label={t('nav.profilePhotosAvatar')}
          style={{marginTop: 15, marginLeft: 15}} onClick={() => browserHistory.push(t.route('profilePhotosAvatar'))} />

        <br />

        <RaisedButton label={t('nav.changePassword')}
          style={{marginTop: 15}} onClick={() => browserHistory.push(t.route('changePassword'))} />
        <br />

        <RaisedButton label={t('nav.changeDetails')}
          style={{marginTop: 15}} onClick={() => browserHistory.push(t.route('changeDetails'))} />

        <br />

        <RaisedButton
          label={this.context.t('login.logoutButton')}
          secondary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.logout()} />
      </Paper>
    );
  }
}
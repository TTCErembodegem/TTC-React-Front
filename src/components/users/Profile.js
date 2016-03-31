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
import { dispayFormat } from '../controls/Telephone.js';


@connect(state => {
  return {
    //config: state.config,
    user: state.user,
    //players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    // teams: state.teams,
  };
}, loginActions)
export default class Login extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    // players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor() {
    super();
  }

  render() {
    const t = this.context.t;
    const paperStyle = {
      height: 410,
      width: 320,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    var player = storeUtil.getPlayer(this.props.user.playerId);

    return (
      <Paper zDepth={1} style={paperStyle}>
        <h3>{this.context.t('profile.headerText')}</h3>

        <p>{this.context.t('profile.loggedInText')}&nbsp;{this._reverseName((player || {name: 'Broken Code'}).name)}</p>
        <p>{this.context.t('profile.email')}&nbsp;{player.contact.email}</p>
        <p>{this.context.t('profile.gsm')}&nbsp;{dispayFormat(player.contact.mobile)}</p>

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
          onClick={::this._onLogout} />
      </Paper>
    );
  }

  _onLogout() {
    this.props.logout();
  }

  _reverseName(name) {
    var nameInParts = name.split(' ');
    if(nameInParts.length === 2)
    {
       return nameInParts[1] + ' ' + nameInParts[0];
    }
    if (nameInParts.length === 3)
    {
       return nameInParts[nameInParts.length - 1] + ' ' + nameInParts[nameInParts.length - 3]
       + ' ' + nameInParts[nameInParts.length - 2] ;
    }
    if (nameInParts.length === 4)
    {
       return nameInParts[nameInParts.length - 1] + ' ' + nameInParts[nameInParts.length - 4]
       + ' ' + nameInParts[nameInParts.length - 3] + ' ' + nameInParts[nameInParts.length - 2];
    }
  }
}
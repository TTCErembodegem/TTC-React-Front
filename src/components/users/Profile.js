import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { util as storeUtil } from '../../store.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import { displayFormat } from '../controls/Telephone.js';
import * as loginActions from '../../actions/userActions.js';

import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import TabbedContainer from '../controls/TabbedContainer.js';

import ChangePassword from '../users/ChangePassword.js';
import ChangePlayerDetails from '../users/ChangePlayerDetails.js';
import ProfilePhotoForm, { ProfilePhotoAvatarForm } from '../users/ProfilePhotoForm.js';
import PlayerLineup from './PlayerLineup.js';

const tabEventKeys = {
  main: 1,
  editDetails: 2,
  editPicture: 3,
  editAvatar: 4,
  editPassword: 5,
  editHolidays: 6,
};

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

  constructor(props) {
    super(props);
  }

  _renderTabContent(eventKey) {
    const player = this.props.user.getPlayer();
    switch (eventKey) {
    case tabEventKeys.main:
      return <ProfilePlayerDetails  t={this.context.t} player={player} logout={this.props.logout} />;
    case tabEventKeys.editDetails:
      return <ChangePlayerDetails player={player} />;
    case tabEventKeys.editPicture:
      return <ProfilePhotoForm />
    case tabEventKeys.editAvatar:
      return <ProfilePhotoAvatarForm />
    case tabEventKeys.editPassword:
      return <ChangePassword />;
    case tabEventKeys.editHolidays:
      return <PlayerLineup user={this.props.user} />;
    }
  }

  render() {
    const t = this.context.t;
    const tabConfig = [{
      key: tabEventKeys.main,
      title: t('profile.main'),
    }, {
      key: tabEventKeys.editDetails,
      title: t('profile.editDetails'),
    }, {
      key: tabEventKeys.editPicture,
      title: t('profile.editPicture'),
    }, {
      key: tabEventKeys.editAvatar,
      title: t('profile.editAvatar'),
    }, {
      key: tabEventKeys.editPassword,
      title: t('profile.editPassword'),
    }, {
      key: tabEventKeys.editHolidays,
      title: t('profile.editHolidays'),
    }];

    return (
      <div style={{marginTop: 15, marginBottom: 20}}>
        <TabbedContainer
          openTabKey={tabEventKeys.main}
          tabKeys={tabConfig}
          tabRenderer={::this._renderTabContent} />
      </div>
    );
  }
}

const ProfilePlayerDetails = ({player, t, logout}) => (
  <div style={{padding: 10}}>
    <h3>{player.name}</h3>
    <p>
      <strong>{t('player.email')}</strong>&nbsp;{player.contact.email}
      <br />
      <strong>{t('player.gsm')}</strong>&nbsp;{displayFormat(player.contact.mobile)}
      <br />
      <strong>{t('player.address')}</strong>&nbsp;{player.contact.address}
      <br />
      <strong>{t('player.city')}</strong>&nbsp;{player.contact.city}
    </p>

    <RaisedButton
      label={t('login.logoutButton')}
      secondary={true}
      style={{marginTop: 15}}
      onClick={() => logout()} />
  </div>
)
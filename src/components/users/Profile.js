import React, {Component} from 'react';
import PropTypes, {connect, keyMirror, withRouter} from '../PropTypes.js';

import * as loginActions from '../../actions/userActions.js';

import {MaterialButton} from '../controls/Button.js';
import {TabbedContainer} from '../controls/TabbedContainer.js';

import ChangePassword from '../users/ChangePassword.js';
import ChangePlayerDetails from '../users/ChangePlayerDetails.js';
import ProfilePhotoForm, {ProfilePhotoAvatarForm} from '../users/ProfilePhotoForm.js';
import PlayerLineup from './PlayerLineup.js';

const tabEventKeys = keyMirror({
  main: '',
  editDetails: '',
  editPicture: '',
  editAvatar: '',
  editPassword: '',
  editHolidays: '',
});


class Profile extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired,
    logout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tabKey: PropTypes.string
      }),
    }),
    history: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
  }

  _logout() {
    this.props.logout();
    this.props.history.push('/');
  }

  _renderTabContent(eventKey) {
    const player = this.props.user.getPlayer();
    switch (eventKey) {
    case tabEventKeys.main:
      return <ProfilePlayerDetails t={this.context.t} player={player} logout={() => this._logout()} />;
    case tabEventKeys.editDetails:
      return <ChangePlayerDetails player={player} />;
    case tabEventKeys.editPicture:
      return <ProfilePhotoForm />;
    case tabEventKeys.editAvatar:
      return <ProfilePhotoAvatarForm />;
    case tabEventKeys.editPassword:
      return <ChangePassword />;
    case tabEventKeys.editHolidays: {
      let user = this.props.user;
      return <PlayerLineup teams={user.getTeams()} playerId={user.playerId} />;
    }
  }
  }

  render() {
    if (!this.props.user.playerId) {
      return <div />;
    }

    const t = this.context.t;
    const tabConfig = [{
      key: tabEventKeys.main,
      title: t('profile.main'),
    }, {
      key: tabEventKeys.editHolidays,
      title: t('profile.editHolidays'),
    }, {
      key: tabEventKeys.editPassword,
      title: t('profile.editPassword'),
    }, {
      key: tabEventKeys.editDetails,
      title: t('profile.editDetails'),
    }, {
      key: tabEventKeys.editPicture,
      title: t('profile.editPicture'),
    }, {
      key: tabEventKeys.editAvatar,
      title: t('profile.editAvatar'),
    }];

    if (this.props.user.isSystem()) {
      return (
        <div>
          <h1>SYSTEM USER</h1>
          <MaterialButton variant="contained"
            label={t('login.logoutButton')}
            secondary={true}
            style={{marginTop: -15}}
            onClick={this.props.logout}
          />
        </div>
      );
    }

    return (
      <div style={{marginTop: 15, marginBottom: 20}}>
        <TabbedContainer
          widthTreshold={760}
          match={this.props.match}
          defaultTabKey={tabEventKeys.main}
          tabKeys={tabConfig}
          route={{base: this.context.t.route('profile'), subs: 'profileTabs'}}
          tabRenderer={eventKey => this._renderTabContent(eventKey)}
        />
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
      <strong>{t('player.gsm')}</strong>&nbsp;{player.contact.getMobile()}
      <br />
      <strong>{t('player.address')}</strong>&nbsp;{player.contact.address}
      <br />
      <strong>{t('player.city')}</strong>&nbsp;{player.contact.city}
    </p>

    <MaterialButton variant="contained"
      label={t('login.logoutButton')}
      secondary={true}
      style={{marginTop: 15}}
      onClick={() => logout()}
    />
  </div>
);

ProfilePlayerDetails.propTypes = {
  player: PropTypes.PlayerModel.isRequired,
  t: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default withRouter(connect(state => {
  return {
    user: state.user,
  };
}, loginActions)(Profile));

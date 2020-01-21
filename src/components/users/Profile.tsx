import React, {Component} from 'react';
import PropTypes, {connect, keyMirror, withRouter} from '../PropTypes';
import * as loginActions from '../../actions/userActions';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import {TabbedContainer} from '../controls/TabbedContainer';
import ChangePassword from './ChangePassword';
import ChangePlayerDetails from './ChangePlayerDetails';
import ProfilePhotoForm, {ProfilePhotoAvatarForm} from './ProfilePhotoForm';
import PlayerLineup from './PlayerLineup';
import {IUser} from '../../models/UserModel';
import {TabbedContainerEventKeyRouteProps, Historian, IPlayer, Translator} from '../../models/model-interfaces';

const tabEventKeys = keyMirror({
  main: '',
  editDetails: '',
  editPicture: '',
  editAvatar: '',
  editPassword: '',
  editHolidays: '',
});


type ProfileProps = {
  user: IUser;
  logout: Function;
  match: TabbedContainerEventKeyRouteProps;
  history: Historian;
}

class Profile extends Component<ProfileProps> {
  static contextTypes = PropTypes.contextTypes;

  _logout() {
    this.props.logout();
    this.props.history.push('/');
  }

  _renderTabContent(eventKey: string) {
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
        const {user} = this.props;
        return <PlayerLineup teams={user.getTeams()} playerId={user.playerId} />;
      }
      default:
        return null;
    }
  }

  render() {
    if (!this.props.user.playerId) {
      return <div />;
    }

    const {t} = this.context;
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
          <MaterialButton
            variant="contained"
            label={t('login.logoutButton')}
            secondary
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

type ProfilePlayerDetailsProps = {
  player: IPlayer,
  t: Translator,
  logout: Function,
};

const ProfilePlayerDetails = ({player, t, logout}: ProfilePlayerDetailsProps) => (
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

    <MaterialButton
      variant="contained"
      label={t('login.logoutButton')}
      secondary
      style={{marginTop: 15}}
      onClick={() => logout()}
    />
  </div>
);

export default withRouter(connect(state => ({user: state.user}), loginActions)(Profile));

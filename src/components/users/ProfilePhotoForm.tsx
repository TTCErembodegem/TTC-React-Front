import React, {Component} from 'react';
import PropTypes, {connect, withContext, storeUtil} from '../PropTypes';
import {uploadPlayer} from '../../actions/userActions';

import {MaterialButton} from '../controls/Button';
import ImageEditor from '../controls/image/ImageEditor';
import {playerUtils} from '../../models/PlayerModel';
import ImageDropzone from '../controls/image/ImageDropzone';
import PlayerAutoComplete from '../players/PlayerAutoComplete';
import PlayerImage from '../players/PlayerImage';
import PlayerAvatar from '../players/PlayerAvatar';
import {IUser} from '../../models/UserModel';

type ProfilePhotoAvatarFormProps = {
  admin?: boolean;
}

export const ProfilePhotoAvatarForm = ({admin, ...props}: ProfilePhotoAvatarFormProps) => (
  <ProfilePhotoForm {...props} admin={admin} size={playerUtils.getPlayerAvatarImageSize()} type="player-avatar" borderRadius={19} />
);



type ProfilePhotoFormProps = ProfilePhotoAvatarFormProps & {
  size: {width: number, height: number},
  type: 'player-photo' | 'player-avatar',
  user: IUser;
  uploadPlayer: Function,
  borderRadius: number;
}

type ProfilePhotoFormState = {
  fileName: null | string;
  preview: null | string;
  croppingRect: null | string;
  playerId: null | number;
}


class ProfilePhotoForm extends Component<ProfilePhotoFormProps, ProfilePhotoFormState> {
  static contextTypes = PropTypes.contextTypes;

  static defaultProps = {
    size: playerUtils.getPlayerImageSize(),
    type: 'player-photo',
    borderRadius: 0,
    admin: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      fileName: null,
      preview: null,
      croppingRect: null,
      playerId: null,
    };
  }

  _updateImage(preview, croppingRect) {
    this.setState({preview, croppingRect});
  }

  _saveImage() {
    this.props.uploadPlayer(this.state.preview, this.state.playerId || this.props.user.playerId, this.props.type);
  }

  render() {
    const {t} = this.context;
    const tmpFileName = this.state.fileName;
    return (
      <div style={{marginBottom: 10, paddingLeft: 10}} className="row">
        <div className="col-sm-6">
          <h3>
            {t('photos.uploadNewTitle')}
            <small> ({this.props.size.width}px x {this.props.size.height}px)</small>
          </h3>

          {this.props.admin ? (
            <PlayerAutoComplete
              selectPlayer={playerId => this.setState({playerId})}
              placeholder={this.context.t('system.playerSelect')}
            />
          ) : null}

          <ImageDropzone t={t} fileUploaded={fileName => this.setState({fileName})} />
          {this.state.fileName ? (
            <div>
              <h3>{t('photos.adjustTitle')}</h3>
              <ImageEditor
                t={t}
                size={this.props.size}
                image={tmpFileName}
                borderRadius={this.props.borderRadius}
                updateImage={(preview, croppingRect) => this.setState({preview: preview.toDataURL(), croppingRect})}
              />
            </div>
          ) : null}
        </div>
        {this.state.preview ? (
          <div className="col-sm-6">
            <div className="thumbnail" style={{width: 250, marginTop: 10}}>
              <img
                src={this.state.preview}
                style={{marginTop: 7, borderRadius: 19}}
                width={this.props.size.width}
                height={this.props.size.height}
              />

              <div className="caption" style={{textAlign: 'center', marginTop: 40}}>
                <MaterialButton
                  label={t('photos.save')}
                  primary
                  style={{marginTop: -40}}
                  onClick={() => this._saveImage()}
                />
              </div>
            </div>
          </div>
        ) : null}
        {!this.props.admin ? (
          <div className="col-sm-6">
            <h3>{t('photos.existingTitle')}</h3>
            {this.props.type === 'player-photo' ? (
              <PlayerImage playerId={this.state.playerId || this.props.user.playerId} />
            ) : (
              <PlayerAvatar player={storeUtil.getPlayer(this.props.user.playerId)} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withContext(connect(state => ({user: state.user}), {uploadPlayer})(ProfilePhotoForm));

import React, {Component} from 'react';
import PropTypes, {connect, withContext, storeUtil} from '../PropTypes.js';
import {uploadPlayer} from '../../actions/userActions.js';

import Button from '@material-ui/core/Button';
import ImageEditor from '../controls/image/ImageEditor.js';
import {playerUtils} from '../../models/PlayerModel.js';
import ImageDropzone from '../controls/image/ImageDropzone.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import PlayerImage from '../players/PlayerImage.js';
import PlayerAvatar from '../players/PlayerAvatar.js';


export class ProfilePhotoAvatarForm extends Component {
  render() {
    return <ProfilePhotoForm {...this.props} size={playerUtils.getPlayerAvatarImageSize()} type="player-avatar" borderRadius={19} />;
  }
}


@withContext
@connect(state => ({user: state.user}), {uploadPlayer})
export default class ProfilePhotoForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    admin: PropTypes.bool,
    user: PropTypes.UserModel.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    type: PropTypes.oneOf(['player-photo', 'player-avatar']).isRequired,
    uploadPlayer: PropTypes.func.isRequired,
    borderRadius: PropTypes.number.isRequired,
  }
  static defaultProps = {
    size: playerUtils.getPlayerImageSize(),
    type: 'player-photo',
    borderRadius: 0,
    admin: false,
  }

  constructor() {
    super();
    this.state = {
      fileName: null,
      preview: null,
      croppingRect: null,
      playerId: null,
    };
  }

  render() {
    const t = this.context.t;
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
              hintText={this.context.t('system.playerSelect')}
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
                updateImage={(preview, croppingRect) => this.setState({preview: preview.toDataURL(), croppingRect})} />
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
                height={this.props.size.height} />

              <div className="caption" style={{textAlign: 'center', marginTop: 10}}>
                <Button
                  label={t('photos.save')}
                  primary={true}
                  style={{marginTop: -40}}
                  onTouchTap={::this._saveImage} />
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

  _updateImage(preview, croppingRect) {
    this.setState({preview, croppingRect});
  }
  _saveImage() {
    this.props.uploadPlayer(this.state.preview, this.state.playerId || this.props.user.playerId, this.props.type);
  }
}

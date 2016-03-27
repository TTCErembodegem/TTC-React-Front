import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import withContext from '../../utils/decorators/withContext.js';
import { contextTypes } from '../../utils/decorators/withContext.js';
import http from '../../utils/httpClient.js';

import AvatarEditor from 'react-avatar-editor';
import Slider from 'material-ui/lib/slider';
import FlatButton from 'material-ui/lib/flat-button';
import Icon from '../controls/Icon.js';
import { playerUtils } from '../../models/PlayerModel.js';
import Dropzone from 'react-dropzone';

const imgSize = playerUtils.getPlayerImageSize();

@withContext
@connect(state => {
  return {
    //config: state.config,
    user: state.user,
  };
})
export default class MyEditor extends Component {
  static contextTypes = contextTypes;
  static propTypes ={
    user: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      fileName: null,
      preview: null,
      croppingRect: null,
    };
  }

  render() {
    const t = this.context.t;
    const tmpFileName = this.state.fileName;
    //const image = playerUtils.getImageUrl(this.props.user.playerId);
    return (
      <div style={{marginTop: 10, marginBottom: 10}} className="row">
        <div className="col-sm-6">
          <h3>{t('photos.uploadNewTitle')}</h3>
          <ImageDropzone t={t} fileUploaded={fileName => this.setState({fileName})} />
          {this.state.fileName ? (
            <div>
              <h3>{t('photos.adjustTitle')}</h3>
              <PlayerImageEditor t={t} image={tmpFileName} updateImage={(preview, croppingRect) => this.setState({preview, croppingRect})} />
            </div>
          ) : null}
        </div>
        {this.state.preview ? (
          <div className="col-sm-6">
            <div className="thumbnail" style={{width: imgSize.width + 10}}>
              <img src={this.state.preview} style={{marginTop: 7}} />
              <div className="caption" style={{textAlign: 'center', marginTop: 10}}>
                <FlatButton
                  label={t('photos.save')}
                  primary={true}
                  style={{marginTop: -40}}
                  onTouchTap={::this._saveImage} />
              </div>
            </div>

            {false && this.state.croppingRect ? // display only if there is a cropping rect
              <ImageWithRect
                width={/*200 * 478 / 270*/40}
                height={/*200*/40}
                image={tmpFileName}
                rect={this.state.croppingRect} />
            : null}
          </div>
        ) : null}
      </div>
    );
  }

  _updateImage(preview, croppingRect) {
    this.setState({preview, croppingRect});
  }
  _saveImage() {
    http.uploadPlayerImage(this.state.preview, this.props.user.playerId)
      .then(function(data) {
        console.log('player-image', data);
      }, function(err) {
        console.log('player-image Upload!', err); // eslint-disable-line
      });

    window.history.back();
  }
}


var PlayerImageEditor = React.createClass({
  propTypes: {
    t: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired,
    updateImage: PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      scale: 1,
      borderRadius: 0,
    };
  },

  render: function() {
    return (
      <div style={{display: 'inline-block', width: '100%'}}>
        <AvatarEditor
          ref="avatar"
          scale={this.state.scale}
          borderRadius={this.state.borderRadius}
          onSave={this.handleSave}
          onLoadFailed={this.logCallback.bind(this, 'onLoadFailed')}
          onUpload={this.logCallback.bind(this, 'onUpload')}
          onImageLoad={this.logCallback.bind(this, 'onImageLoad')}
          image={this.props.image}
          style={{width: imgSize.width, height: imgSize.height, cursor: 'hand'}} />

          <Slider defaultValue={1} min={1} max={2} step={0.01}
            ref="scale"
            style={{width: 230, marginBottom: 20, marginTop: 20}}
            onChange={this.handleScale} />

          <FlatButton
            label={this.props.t('photos.preview')}
            secondary={true}
            style={{marginTop: -40, marginBottom: 10}}
            onTouchTap={::this.handleSave} />
      </div>
    );
  },

  handleSave: function(data) {
    var img = this.refs.avatar.getImage();
    var rect = this.refs.avatar.getCroppingRect();
    this.props.updateImage(img, rect);
  },

  handleScale: function() {
    var scale = parseFloat(this.refs.scale.getValue());
    this.setState({scale: scale});
  },

  // handleBorderRadius: function() {
  //   var borderRadius = parseInt(this.refs.borderRadius.value, 10);
  //   this.setState({borderRadius: borderRadius});
  // },

  logCallback: function(e) {
    console.log('callback', e);
  },
});

//<input name="scale" type="range" ref="scale" min="1" max="2" step="0.01" defaultValue="1" onChange={this.handleScale} />
//Border radius: <input name="scale" type="range" ref="borderRadius" onChange={this.handleBorderRadius} min="0" max="100" step="1" defaultValue="0" />

class ImageWithRect extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    rect: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    style: PropTypes.object,
  }
  componentDidMount() {
    this._redraw();
  }
  componentDidUpdate() {
    this._redraw();
  }

  _redraw() {
    var img = new Image();

    img.onload = function(ctx, rect, width, height) {
      ctx.drawImage(img, 0, 0, width, height);

      if (rect) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(
          Math.round(rect.x * width) + 0.5,
          Math.round(rect.y * height) + 0.5,
          Math.round(rect.width * width),
          Math.round(rect.height * height)
        );
      }
    }.bind(this, this.refs.root.getContext('2d'), this.props.rect, this.props.width, this.props.height);

    img.src = this.props.image;
  }

  render() {
    return (
      <canvas
        ref="root"
        style={this.props.style}
        width={this.props.width}
        height={this.props.height} />
    );
  }
}

class ImageDropzone extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fileUploaded: PropTypes.func.isRequired,
  }

  _onDrop(files) {
    var self = this;
    http.upload(files)
      .then(function(data) {
        if (data && data.fileName) {
          self.props.fileUploaded(data.fileName);
        }
      }, function(err) {
        console.log('Upload!', err); // eslint-disable-line
      });
  }

  render() {
    var style = {
      width: 250,
      height: 55,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: 5
    };

    return (
      <div>
        <Dropzone ref="dropzone" onDrop={::this._onDrop} style={style} multiple={false}>
          <div>{this.props.t('photos.uploadNewInstructions')}</div>
        </Dropzone>
      </div>
    );
  }
}
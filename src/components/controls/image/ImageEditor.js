import React, {PropTypes} from 'react';
import Slider from 'material-ui/Slider';
import AvatarEditor from 'react-avatar-editor';
import FlatButton from 'material-ui/FlatButton';

// TODO: Check to replace with: http://blog.mmcfarland.net/react-darkroom/

const ImageEditor = React.createClass({
  propTypes: {
    t: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired,
    updateImage: PropTypes.func.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    borderRadius: PropTypes.number.isRequired,
  },
  getInitialState: function() {
    return {
      scale: 1,
      borderRadius: this.props.borderRadius,
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
          style={{width: this.props.size.width, height: this.props.size.height, cursor: 'hand'}} />

        <Slider defaultValue={1} min={1} max={5} step={0.01}
          ref="scale"
          style={{width: 230, marginBottom: 20, marginTop: 20}}
          onChange={this.handleScale}
        />

        <FlatButton
          label={this.props.t('photos.preview')}
          secondary={true}
          style={{marginTop: -40, marginBottom: 10}}
          onTouchTap={this.handleSave}
        />
      </div>
    );
  },

  handleSave: function(/*data*/) {
    const img = this.refs.avatar.getImageScaledToCanvas();
    const rect = this.refs.avatar.getCroppingRect();
    this.props.updateImage(img, rect);
  },

  handleScale: function() {
    const scale = parseFloat(this.refs.scale.getValue());
    this.setState({scale: scale});
  },

  // handleBorderRadius: function() {
  //   var borderRadius = parseInt(this.refs.borderRadius.value, 10);
  //   this.setState({borderRadius: borderRadius});
  // },

  logCallback: function(e) {
    console.log('callback', e); //eslint-disable-line
  },
});

export default ImageEditor;

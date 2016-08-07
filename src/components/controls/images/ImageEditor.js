import React, { PropTypes } from 'react';
import Slider from 'material-ui/lib/slider';
import AvatarEditor from 'react-avatar-editor';
import FlatButton from 'material-ui/lib/flat-button';

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

  handleSave: function(/*data*/) {
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
    console.log('callback', e); //eslint-disable-line
  },
});

export default ImageEditor;

//<input name="scale" type="range" ref="scale" min="1" max="2" step="0.01" defaultValue="1" onChange={this.handleScale} />
//Border radius: <input name="scale" type="range" ref="borderRadius" onChange={this.handleBorderRadius} min="0" max="100" step="1" defaultValue="0" />


// {this.state.croppingRect ? // display only if there is a cropping rect
//   <ImageWithRect
//     width={200 * 478 / 270}
//     height={200}
//     image={tmpFileName}
//     rect={this.state.croppingRect} />
// : null}


// class ImageWithRect extends Component {
//   static propTypes = {
//     image: PropTypes.string.isRequired,
//     rect: PropTypes.object.isRequired,
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     style: PropTypes.object,
//   }
//   componentDidMount() {
//     this._redraw();
//   }
//   componentDidUpdate() {
//     this._redraw();
//   }

//   _redraw() {
//     var img = new Image();

//     img.onload = function(ctx, rect, width, height) {
//       ctx.drawImage(img, 0, 0, width, height);

//       if (rect) {
//         ctx.strokeStyle = 'red';
//         ctx.strokeRect(
//           Math.round(rect.x * width) + 0.5,
//           Math.round(rect.y * height) + 0.5,
//           Math.round(rect.width * width),
//           Math.round(rect.height * height)
//         );
//       }
//     }.bind(this, this.refs.root.getContext('2d'), this.props.rect, this.props.width, this.props.height);

//     img.src = this.props.image;
//   }

//   render() {
//     return (
//       <canvas
//         ref="root"
//         style={this.props.style}
//         width={this.props.width}
//         height={this.props.height} />
//     );
//   }
// }
import PropTypes from 'prop-types';
import React from 'react';
import Slider from '@material-ui/lab/Slider';
import AvatarEditor from 'react-avatar-editor';
import {MaterialButton} from '../Button';

// TODO: Check to replace with: http://blog.mmcfarland.net/react-darkroom/

export default class ImageEditor extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired,
    updateImage: PropTypes.func.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    borderRadius: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: this.props.borderRadius,
    };
  }

  setEditorRef = editor => {
    this.editor = editor;
  };

  render() {
    return (
      <div style={{display: 'inline-block', width: '100%'}}>
        <AvatarEditor
          ref={this.setEditorRef}
          scale={this.state.scale}
          borderRadius={this.state.borderRadius}
          image={this.props.image}
          style={{width: this.props.size.width, height: this.props.size.height, cursor: 'hand'}}
        />

        <Slider
          value={this.state.scale}
          min={1}
          max={5}
          step={0.01}
          ref="scale"
          style={{width: 230, marginBottom: 20, marginTop: 20}}
          onChange={(event, newScale) => this.setState({scale: newScale})}
        />

        <br />

        <MaterialButton
          label={this.props.t('photos.preview')}
          secondary
          style={{marginTop: -40, marginBottom: 10}}
          onClick={this.onClickSave}
        />
      </div>
    );
  }

  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      // const canvasScaled = this.editor.getImageScaledToCanvas();
      this.props.updateImage(canvas, {});
    }
  }
}

import React, { PropTypes, Component } from 'react';
import http from '../../../utils/httpClient.js';
import Dropzone from 'react-dropzone';

export default class ImageDropzone extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fileUploaded: PropTypes.func.isRequired,
    type: PropTypes.string,
  }

  _onDrop(files) {
    const self = this;
    http.upload(files, this.props.type)
      .then(function(data) {
        if (data && data.fileName) {
          self.props.fileUploaded(data.fileName);
        }
      }, function(err) {
        console.error('upload fail!', err); // eslint-disable-line
      });
  }

  render() {
    const style = {
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
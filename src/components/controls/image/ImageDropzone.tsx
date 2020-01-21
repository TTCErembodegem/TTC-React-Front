/* eslint-disable react/no-string-refs */
import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import http from '../../../utils/httpClient';
import {Translator} from '../../../models/model-interfaces';

type ImageDropzoneProps = {
  t: Translator;
  fileUploaded: Function;
  type?: string;
}

export default class ImageDropzone extends Component<ImageDropzoneProps> {
  _onDrop(files) {
    const self = this;
    http.upload(files, this.props.type)
      .then(data => {
        if (data && data.fileName) {
          self.props.fileUploaded(data.fileName);
        }
      }, err => {
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
      padding: 5,
    };

    return (
      <div>
        <Dropzone ref="dropzone" onDrop={files => this._onDrop(files)} style={style} multiple={false}>
          <div>{this.props.t('photos.uploadNewInstructions')}</div>
        </Dropzone>
      </div>
    );
  }
}

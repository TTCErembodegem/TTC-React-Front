import React, { Component, PropTypes } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';
import UserModel from '../../../models/UserModel.js';

import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';
import Editor from 'react-medium-editor';

export default class OpponentsFormation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.instanceOf(UserModel).isRequired,
    match: PropTypes.instanceOf(MatchModel).isRequired,
    t: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div>
        <Editor
          tag="pre"
          text={'whee a test'}

          options={{toolbar: {buttons: ['bold', 'italic', 'underline']}}}
        />
      </div>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';

import { displayFormat } from '../controls/Telephone.js';
import * as loginActions from '../../actions/userActions.js';


@connect(state => {
  return {
    //config: state.config,
    //user: state.user,
  };
}, loginActions)
export default class PlayerLinup extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const t = this.context.t;

    return (
      <div style={{marginTop: 15, marginBottom: 20}}>
        TODO :)
      </div>
    );
  }
}
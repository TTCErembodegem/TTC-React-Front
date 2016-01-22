import React, { PropTypes, Component } from 'react';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Icon.css';

@withStyles(styles)
export default class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <i className={this.props.fa}></i>
      </div>
    );
  }
}
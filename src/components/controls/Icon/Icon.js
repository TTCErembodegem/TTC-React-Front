import React, { PropTypes, Component } from 'react';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Icon.css';

@withStyles(styles)
export default class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string
  };

  render() {
    return (<i className={this.props.fa} style={{color: this.props.color}}></i>);
  }
}
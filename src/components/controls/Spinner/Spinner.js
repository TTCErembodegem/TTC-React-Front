import React, { PropTypes, Component } from 'react';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Spinner.css';

import Icon from '../Icon';

@withStyles(styles)
export default class Spinner extends Component {
  // static propTypes = {
  //   config: PropTypes.object,
  //   players: PropTypes.array,
  // };

  render() {
    return (
      <div>
        <Icon fa="fa fa-spinner fa-pulse" />
      </div>
    );
  }
}
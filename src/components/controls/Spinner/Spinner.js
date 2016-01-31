import React, { PropTypes, Component } from 'react';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Spinner.css';

import Icon from '../Icon';

@withStyles(styles)
export default class Spinner extends Component {

  static defaultProps = {
    size: 1,
  };

  static propTypes = {
    size: PropTypes.number,
  };

  render() {
    return (
      <div>
        <Icon fa={'fa fa-spinner fa-pulse fa-' + this.props.size + 'x'} />
      </div>
    );
  }
}
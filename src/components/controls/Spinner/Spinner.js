import React, { PropTypes, Component } from 'react';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Spinner.css';

@withStyles(styles)
export default class App extends Component {
  // static propTypes = {
  //   config: PropTypes.object,
  //   players: PropTypes.array,
  // };

  render() {
    return (
      <div>
        <i className="fa fa-spinner fa-pulse"></i>
      </div>
    );
  }
}
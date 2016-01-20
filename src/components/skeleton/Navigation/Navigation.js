import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'
import classNames from 'classnames';

import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Navigation.css';

@withStyles(styles)
export default class Navigation extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <Link className="Navigation-link" to="/over">Over</Link>
        <Link className="Navigation-link" to="/spelers">Spelers</Link>

        <span className="Navigation-spacer"> | </span>
        <Link className="Navigation-link" to="/login">Log in</Link>
        <span className="Navigation-spacer">or</span>
        <Link className="Navigation-link Navigation-link--highlight" to="/register">Sign up</Link>
      </div>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'
import classNames from 'classnames';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Navigation.css';

@withStyles(styles)
export default class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <Link className="Navigation-link" to="/spelers">{this.context.t('nav.players')}</Link>

        <span className="Navigation-spacer"> | </span>
        <Link className="Navigation-link" to="/login">Log in</Link>
      </div>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import { contextTypes } from '../../../utils/decorators/withContext.js';

export default class Navigation extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div className="Header-nav" role="navigation">
        <Link className="Header-link" to="/spelers">{this.context.t('nav.players')}</Link>

        <span className="Header-spacer"> | </span>
        <Link className="Header-link" to="/login">{this.context.t('nav.login')}</Link>
      </div>
    );
  }
}
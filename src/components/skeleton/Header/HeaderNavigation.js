import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import { contextTypes } from '../../../utils/decorators/withContext.js';

import Icon from '../../controls/Icon.js';

export default class Navigation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    return (
      <div className="Header-nav" role="navigation">
        <Link className="Header-link" to="/spelers">{this.context.t('nav.players')}</Link>
        <Link className="Header-link" to="/links">{this.context.t('nav.links')}</Link>

        <span className="Header-spacer"> | </span>
        {!this.props.user.playerId ?
          <Link className="Header-link" to="/login">{this.context.t('nav.login')}</Link> :
          <Link className="Header-link" to="/profiel"><Icon fa="fa fa-user" /></Link>
        }
      </div>
    );
  }
}
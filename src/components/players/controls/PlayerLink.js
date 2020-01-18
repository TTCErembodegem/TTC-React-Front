import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from '../../PropTypes.js';
import t from '../../../locales.js';

export class PlayerLink extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    alias: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: 'link-hover-underline',
  }

  render() {
    const {player, alias, children, className, staticContext, ...props} = this.props; // eslint-disable-line

    const url = t.route('player').replace(':playerId', encodeURI(player.slug));
    return (
      <Link to={url} className={className} {...props}>
        {this.getContent()}
      </Link>
    );
  }

  getContent() {
    const {player, alias, children} = this.props;
    if (children) {
      return children;
    }
    return alias ? player.alias : player.name;
  }
}

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import t from '../../../locales';
import {IPlayer} from '../../../models/model-interfaces';

type PlayerLinkProps = {
  player: IPlayer;
  alias?: boolean;
  children?: any;
  className?: string;
  style?: React.CSSProperties;
}

export class PlayerLink extends Component<PlayerLinkProps> {
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

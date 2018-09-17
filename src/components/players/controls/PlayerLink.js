import React, {Component} from 'react';
import PropTypes, {withRouter} from '../../PropTypes.js';
import t from '../../../locales.js';

@withRouter
export class PlayerLink extends Component {
  static propTypes = {
    history: PropTypes.any.isRequired,
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
      <a onClick={() => this.props.history.push(url)} className={className} {...props}>
        {this.getContent()}
      </a>
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

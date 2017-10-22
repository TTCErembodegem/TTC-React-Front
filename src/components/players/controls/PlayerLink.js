import React, {Component} from 'react';
import PropTypes, {browseTo} from '../../PropTypes.js';

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
    const {player} = this.props;
    return (
      <a onClick={() => browseTo.player(player)} className={this.props.className}>
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

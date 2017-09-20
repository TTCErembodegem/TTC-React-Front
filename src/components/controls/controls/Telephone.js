import React, {PropTypes, Component} from 'react';
import {Icon} from '../Icons/Icon.js';
import {displayMobile} from '../../../models/PlayerModel.js';

function callFormat(n) {
  return n;
  //return '+32' + n.substr(1);
}

export class Telephone extends Component {
  static propTypes = {
    number: PropTypes.string,
    player: PropTypes.object,
    hideIcon: PropTypes.bool,
  }
  static defaultProps = {
    hideIcon: false
  }

  render() {
    if (!this.props.number && !this.props.player) {
      return null;
    }

    const {number, hideIcon, player, ...props} = this.props;
    var nr = player ? player.contact.mobile : number;
    if (hideIcon) {
      return <a href={'tel:' + callFormat(number)} {...props}>{displayMobile(number)}</a>;
    }

    return (
      <div className="iconize" {...props}>
        <Icon fa="fa fa-phone" />
        <a style={{marginLeft: 7}} href={'tel:' + callFormat(number)}>{displayMobile(number)}</a>
      </div>
    );
  }
}
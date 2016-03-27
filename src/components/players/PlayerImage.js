import React, { PropTypes, Component } from 'react';
import { playerUtils } from '../../models/PlayerModel.js';

export default class PlayerImage extends Component {
  static propTypes = {
    playerId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    var img = new Image();
    img.onload = () => this.setState({isLoaded: true});
    img.src = playerUtils.getImageUrl(this.props.playerId);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div style={{textAlign: 'center', marginTop: 10, opacity: 0.4}}>
          <span className="fa-stack fa-4x">
            <i className="fa fa-camera fa-stack-1x"></i>
            <i className="fa fa-ban fa-stack-2x text-danger"></i>
          </span>
        </div>
      );
    }

    return <div style={{textAlign: 'center'}}><img src={this.state.img} /></div>;
  }
}
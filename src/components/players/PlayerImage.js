import React, {PropTypes, Component} from 'react';
import {playerUtils} from '../../models/PlayerModel.js';

export default class PlayerImage extends Component {
  static propTypes = {
    playerId: PropTypes.number.isRequired,
    center: PropTypes.bool,
  }
  static defaultProps = {
    center: true,
  };

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
    const align = this.props.center ? 'center' : undefined;
    if (!this.state.isLoaded) {
      return (
        <div style={{textAlign: align, marginTop: 10, opacity: 0.4, height: 189}}>
          <span className="fa-stack fa-5x">
            <i className="fa fa-camera fa-stack-1x" />
            <i className="fa fa-ban fa-stack-2x text-danger" />
          </span>
        </div>
      );
    }

    return (
      <div style={{textAlign: align}}>
        <img src={this.state.img} className="img-circle" style={{height: 200}} />
      </div>
    );
  }
}

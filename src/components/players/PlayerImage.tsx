import React, {Component} from 'react';
import {playerUtils} from '../../models/PlayerModel';

type PlayerImageProps = {
  playerId: number;
  center?: boolean;
  shape?: 'rounded' | 'thumbnail' | 'circle';
}

type PlayerImageState = {
  isLoaded: boolean;
  img: string;
}

export default class PlayerImage extends Component<PlayerImageProps, PlayerImageState> {
  static defaultProps = {
    center: true,
    shape: 'rounded',
  };

  constructor(props) {
    super(props);

    const img = new Image();
    img.onload = () => this.setState({isLoaded: true});
    img.src = playerUtils.getImageUrl(this.props.playerId);

    this.state = {
      isLoaded: false,
      img: img.src,
    };
  }

  render() {
    const {center, playerId, shape, ...props} = this.props; // eslint-disable-line
    const align = center ? 'center' : undefined;
    if (!this.state.isLoaded) {
      return (
        <div style={{textAlign: align, marginTop: 10, opacity: 0.4, height: 189}} {...props}>
          <span className="fa-stack fa-5x">
            <i className="fa fa-camera fa-stack-1x" />
            <i className="fa fa-ban fa-stack-2x text-danger" />
          </span>
        </div>
      );
    }

    return (
      <div style={{textAlign: align}} {...props}>
        <img src={this.state.img} className={`img-${shape}`} style={{height: 200}} alt="Speler" />
      </div>
    );
  }
}

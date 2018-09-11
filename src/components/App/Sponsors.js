import React, {Component} from 'react';
import PropTypes from '../PropTypes.js';
import {Location} from '../controls.js';
import Paper from 'material-ui/Paper';

const topSponsorPaperStyle = {
  height: 110,
  padding: 15,
  display: 'inline-block',
};

const topSponsorsOnBottomPaperStyle = {
  padding: 15,
  width: 300,
  margin: 'auto',
};

export class BakkerijVanLierde extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    big: PropTypes.bool.isRequired,
  };

  render() {
    const loc = {
      description: 'Brood & banket Van Lierde',
      address: 'Hogeweg 113',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053212720',
    };

    return (
      <a href="https://www.facebook.com/BakkerijKarelVanLierde" target="_blank">
        <Paper style={this.props.big ? {...topSponsorPaperStyle} : topSponsorsOnBottomPaperStyle}>
          <Location loc={loc} t={this.context.t} />
        </Paper>
      </a>
    );
  }
}

export class SlagerijGuy extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    big: PropTypes.bool.isRequired,
  };

  render() {
    const loc = {
      description: 'Slagerij Guy',
      address: 'Erembodegem Dorp 72',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053211359',
    };

    const style = this.props.big ? {...topSponsorPaperStyle, float: 'right'} : topSponsorsOnBottomPaperStyle;
    return (
      <a href="https://www.facebook.com/Slagerij-Guy-en-Paula-805454896289871" target="_blank">
        <Paper style={style}>
          <Location loc={loc} t={this.context.t} />
        </Paper>
      </a>
    );
  }
}



export const StoneDesign = props => <ImageSponsor url="https://www.stonedesign.be" img="stonedesign.png" {...props} />;
export const Symphony = props => <ImageSponsor url="http://doopsuikersymphony.be" img="symphony.png" {...props} />;
// export const pongit = props => <ImageSponsor url="https://pongit.be" img="pongit.jpg" {...props} />;
export const itenium = props => <ImageSponsor url="https://itenium.be" img="itenium.png" {...props} />;
export const Nostech = props => <ImageSponsor url="https://www.nostech.be" img="nostech.jpg" {...props} />;
// export const KachelsTfe = props => <ImageSponsor url="https://www.kachels-tfe.be/" img="kachels-tfe.png" {...props} />;


const bottomSponsorsStyleBig = {
  padding: 5,
  textAlign: 'center',
  display: 'inline-block'
};

const bottomSponsorsStyleSmall = {
  padding: 15,
  width: '100%',
  textAlign: 'center',
  margin: 'auto',
};


class ImageSponsor extends Component {
  static propTypes = {
    big: PropTypes.bool.isRequired,
    url: PropTypes.string,
    img: PropTypes.string.isRequired,
    style: PropTypes.object,
  };
  static defaultProps = {
    style: {},
  };

  render() {
    const style = this.props.big ? bottomSponsorsStyleBig : bottomSponsorsStyleSmall;
    const img = <img src={'/img/sponsors/' + this.props.img} />;
    return (
      <Paper style={{...style, ...this.props.style}}>
        {this.props.url ? <a href={this.props.url} target="_blank">{img}</a> : img}
      </Paper>
    );
  }
}

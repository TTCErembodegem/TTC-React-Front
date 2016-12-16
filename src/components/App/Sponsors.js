import React, { Component } from 'react';
import PropTypes, { connect, withViewport, withContext, withStyles } from '../PropTypes.js';
import moment from 'moment';

import Strike from '../controls/Strike.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';
import Location from '../controls/Location.js';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Paper from 'material-ui/Paper';

const topSponsorPaperStyle = {
  height: 100,
  width: 250,
  padding: 15,
  display: 'inline-block',
};

const topSponsorsOnBottomPaperStyle = {
  padding: 15,
  width: 220,
  margin: 'auto',
};

const bottomSponsorsStyleSmall = {
  padding: 15,
  width: '100%',
  textAlign: 'center',
  margin: 'auto',
};

const bottomSponsorsStyleBig = {
  padding: 5,
  textAlign: 'center',
  display: 'inline-block'
};

export class BakkerijVanLierde extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    top: PropTypes.bool.isRequired,
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
      <Paper style={this.props.top ? topSponsorPaperStyle : topSponsorsOnBottomPaperStyle}>
        <Location loc={loc} t={this.context.t} />
      </Paper>
    );
  }
}

export class SlagerijGuy extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    top: PropTypes.bool.isRequired,
  };

  render() {
    const loc = {
      description: 'Slagerij Guy',
      address: 'Erembodegem Dorp 72',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053211359',
    };

    const style = this.props.top ? {...topSponsorPaperStyle, float: 'right', width: 200} : topSponsorsOnBottomPaperStyle;
    return (
      <Paper style={style}>
        <Location loc={loc} t={this.context.t} />
      </Paper>
    );
  }
}

export const StoneDesign = ({top, style}) => <ImageSponsor top={top} url="http://www.stonedesign.be" img="stonedesign.png" style={style} />;
export const Vdhkeukens = ({top, style}) => <ImageSponsor top={top} url="http://vdhkeukens.be" img="vdhkeukens.png" style={style} />;
export const Symphony = ({top, style}) => <ImageSponsor top={top} url="http://doopsuikersymphony.be" img="symphony.png" style={style} />;
export const pongit = ({top, style}) => <ImageSponsor top={top} img="pongit.jpg" style={style} />;
export const Nostech = ({top, style}) => <ImageSponsor top={top} url="http://www.nostech.be" img="nostech.jpg" style={style} />;

class ImageSponsor extends Component {
  static propTypes = {
    top: PropTypes.bool.isRequired,
    url: PropTypes.string,
    img: PropTypes.string.isRequired,
    style: PropTypes.object,
  };
  static defaultProps = {
    style: {},
  };

  render() {
    const style = this.props.top ? bottomSponsorsStyleBig : bottomSponsorsStyleSmall;
    const img = <img src={'/img/sponsors/' + this.props.img} />;
    return (
      <Paper style={{...style, ...this.props.style}}>
        {this.props.url ? <a href={this.props.url} target="_blank">{img}</a> : img}
      </Paper>
    );
  }
}
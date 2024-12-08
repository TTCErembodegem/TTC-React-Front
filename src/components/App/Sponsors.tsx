import React, {Component} from 'react';
import Paper from '@mui/material/Paper';
import PropTypes from '../PropTypes';
import {Location} from '../controls/controls/Location';

const topSponsorPaperStyle: React.CSSProperties = {
  height: 110,
  padding: 15,
  display: 'inline-block',
  marginBottom: 15,
  float: 'right',
};

const topSponsorsOnBottomPaperStyle: React.CSSProperties = {
  padding: 15,
  width: 300,
  margin: 'auto',
};

type SlagerijGuyProps = {
  big: boolean;
}

export class SlagerijGuy extends Component<SlagerijGuyProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const loc = {
      description: 'Slagerij Guy',
      address: 'Erembodegem Dorp 72',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053211359',
    };

    const style: React.CSSProperties = this.props.big ? {...topSponsorPaperStyle} : topSponsorsOnBottomPaperStyle;
    return (
      <a href="https://www.facebook.com/Slagerij-Guy-en-Paula-805454896289871" target="_blank" className="sponsor-paper" rel="noopener noreferrer">
        <Paper style={style}>
          <Location loc={loc} t={this.context.t} noTelephoneLink />
        </Paper>
      </a>
    );
  }
}



// export const Symphony = props => <ImageSponsor url="http://doopsuikersymphony.be" img="symphony.png" {...props} />;
export const RdInterieur = props => <ImageSponsor url="https://www.rd-interieur.be/" img="rd-interieur.png" {...props} />;
export const BeSure2 = props => <ImageSponsor url="https://www.2besure2.be/" img="2be-sure2.png" {...props} />;
export const TransformerService = props => <ImageSponsor url="https://www.transformerservice.eu/" img="transformer-service.png" {...props} />;
export const itenium = props => <ImageSponsor url="https://itenium.be" img="itenium.png" {...props} />;
export const Nostech = props => <ImageSponsor url="https://www.nostech.be" img="nostech.jpg" {...props} />;


const bottomSponsorsStyleBig: React.CSSProperties = {
  padding: 5,
  textAlign: 'center',
  display: 'inline-block',
};

const bottomSponsorsStyleSmall: React.CSSProperties = {
  padding: 15,
  width: '100%',
  textAlign: 'center',
  margin: 'auto',
};


type ImageSponsorProps = {
  big: boolean;
  url?: string;
  img: string;
  style?: React.CSSProperties;
}

class ImageSponsor extends Component<ImageSponsorProps> {
  static defaultProps = {
    style: {},
  };

  render() {
    const style = this.props.big ? bottomSponsorsStyleBig : bottomSponsorsStyleSmall;
    const img = <img src={`/img/sponsors/${this.props.img}`} alt="Sponsor logo" />;
    return (
      <Paper style={{...style, ...this.props.style}}>
        {this.props.url ? <a href={this.props.url} target="_blank" rel="noopener noreferrer">{img}</a> : img}
      </Paper>
    );
  }
}

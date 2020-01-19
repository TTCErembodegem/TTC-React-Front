import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from '../PropTypes';
import {Location} from '../controls/controls/Location';

const topSponsorPaperStyle = {
  height: 110,
  padding: 15,
  display: 'inline-block',
  marginBottom: 15,
  float: 'right',
};

const topSponsorsOnBottomPaperStyle = {
  padding: 15,
  width: 300,
  margin: 'auto',
};


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

    const style = this.props.big ? {...topSponsorPaperStyle} : topSponsorsOnBottomPaperStyle;
    return (
      <a href="https://www.facebook.com/Slagerij-Guy-en-Paula-805454896289871" target="_blank" className="sponsor-paper">
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


const bottomSponsorsStyleBig = {
  padding: 5,
  textAlign: 'center',
  display: 'inline-block',
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
    const img = <img src={`/img/sponsors/${this.props.img}`} />;
    return (
      <Paper style={{...style, ...this.props.style}}>
        {this.props.url ? <a href={this.props.url} target="_blank">{img}</a> : img}
      </Paper>
    );
  }
}

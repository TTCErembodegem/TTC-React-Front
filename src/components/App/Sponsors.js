import React, {Component} from 'react';
import PropTypes from '../PropTypes.js';
import {Location} from '../controls.js';
import Paper from '@material-ui/core/Paper';

const topSponsorPaperStyle = {
  height: 110,
  padding: 15,
  display: 'inline-block',
  marginBottom: 15,
  float: 'right'
};

const topSponsorsOnBottomPaperStyle = {
  padding: 15,
  width: 300,
  margin: 'auto',
};


// export class SlagerijGuy extends Component {
//   static contextTypes = PropTypes.contextTypes;
//   static propTypes = {
//     big: PropTypes.bool.isRequired,
//   };

//   render() {
//     const loc = {
//       description: 'Slagerij Guy',
//       address: 'Erembodegem Dorp 72',
//       postalCode: 9320,
//       city: 'Erembodegem',
//       mobile: '053211359',
//     };

//     const style = this.props.big ? {...topSponsorPaperStyle} : topSponsorsOnBottomPaperStyle;
//     return (
//       <a href="https://www.facebook.com/Slagerij-Guy-en-Paula-805454896289871" target="_blank" className="sponsor-paper">
//         <Paper style={style}>
//           <Location loc={loc} t={this.context.t} noTelephoneLink={true} />
//         </Paper>
//       </a>
//     );
//   }
// }



export const RdInterieur = props => <ImageSponsor url="https://www.rd-interieur.be/" img="rd-interieur.png" {...props} />;
export const BeSure2 = props => <ImageSponsor url="https://www.2besure2.be/" img="2be-sure2.png" {...props} />;
export const itenium = props => <ImageSponsor url="https://itenium.be" img="itenium.png" {...props} />;
export const AcademicSoftware = props => <ImageSponsor url="https://www.academicsoftware.eu" img="ACADEMIC-SOFTWARE.png" {...props} />;
export const Bordman = props => <ImageSponsor url="https://www.bordman.be/" img="Bordman.png" {...props} />;
export const COOLDown = props => <ImageSponsor url="https://www.facebook.com/CooldownAffligem" img="COOLDown.png" {...props} />;
export const Geniaal = props => <ImageSponsor url="https://www.geniaal-vastgoed.be" img="Geniaal.jpg" {...props} />;
export const RJConstruct = props => <ImageSponsor url="http://www.rjconstruct.com" img="rjconstruct.png" {...props} />;
export const TuinenRottiers = props => <ImageSponsor url="https://www.facebook.com/Tuinen-Rottiers-708944405932087" img="Tuinen-Rottiers.png" {...props} />;
export const EcoProject = props => <ImageSponsor url="https://eco-project.be/" img="eco-project.png" {...props} />;
export const Woodchuck = props => <ImageSponsor url="https://woodchuck.be/" img="Woodchuck.png" {...props} />;



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

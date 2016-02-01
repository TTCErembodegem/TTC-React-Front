import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'

import styles from './Footer.css';
import withViewport from '../../../utils/decorators/withViewport.js';
import withStyles from '../../../utils/decorators/withStyles.js';

import Icon from '../../controls/Icon';

@withViewport
@withStyles(styles)
export default class Footer extends Component {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };

  render() {
    // This is just an example how one can render CSS
    const { width, height } = this.props.viewport;
    //this.renderCss(`.Footer-viewport:after {content:' ${width}x${height}';}`);

    return (
      <div className="Footer">
        <div className="Footer-container">
           <div className="col-xs-1 col-md-1"><Icon fa="fa fa-map-marker" /></div>
           <div className="col-xs-11 col-lg-5 text">Groeneweg 28, 9300 Erembodegem</div>
           <div className="col-xs-1"><Icon fa="fa fa-calendar" /></div>
           <div className="col-xs-11 col-lg-5 text">Training: Dinsdag en donderdag vanaf 20u</div>
           <div className="col-xs-1 col-lg-push-6"><Icon fa="fa fa-calendar" /></div>
           <div className="col-xs-11 col-lg-5 col-lg-push-6 text">Competitie: Maandag, woensdag en vrijdag om 20u</div>
           <div className="col-xs-1 col-lg-pull-6" ><Icon fa="fa fa-envelope-o" /></div>
           <div className="col-xs-11 col-lg-5 col-lg-pull-6 text"><a href="mailto:dirk.desmedt@skynet.be">dirk.desmedt@skynet.be (Dirk De Smedt (Voorzitter))</a></div>
           <div className="col-xs-1"><Icon fa="fa fa-phone" /></div>
           <div className="col-xs-11 col-lg-5 text">0495/24 94 20</div>
           <div className="col-xs-0"></div>
           <div className="col-xs-1"><Icon fa="fa fa-eur" /></div>
           <div className="col-xs-11 col-lg-5 text">€90 voor volwassenen</div>
           <div className="col-xs-1 col-lg-7"></div>
           <div className="col-xs-11 col-lg-5 text">€50 voor -18 jarigen</div>
        </div>
      </div>
    );
  }
}
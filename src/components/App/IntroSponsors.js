import React, {Component} from 'react';
import PropTypes, {withViewport, withContext} from '../PropTypes.js';
import {Strike} from '../controls.js';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import * as Sponsor from './Sponsors.js';


@withContext
@withViewport
export default class IntroSponsors extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
  };

  render() {
    const big = this.props.viewport.width > 830;
    if (big) {
      return (
        <Row style={{marginTop: 25, marginBottom: 15}}>
          <div style={{width: 770, margin: 'auto'}}>
            <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
            <Sponsor.AcademicSoftware big={big} />
            <Sponsor.itenium big={big}style={{marginLeft: 20}} />
          </div>
          <div style={{width: 770, margin: 'auto', paddingTop: 25}}>
            <Sponsor.RdInterieur big={big} />
            <Sponsor.BeSure2 big={big} style={{marginLeft: 20}} />
          </div>
          <div style={{width: 770, margin: 'auto', paddingTop: 25, display: 'flex'}}>
            <div>
              <Sponsor.Woodchuck big={big} />
            </div>
            <div style={{marginLeft: 20}}>
              <Sponsor.Bordman big={big} style={{marginBottom: 15}} />
              <Sponsor.RJConstruct big={big} style={{marginBottom: 20}} />
              <Sponsor.EcoProject big={big} />
            </div>

          </div>
          <div style={{width: 770, margin: 'auto', paddingTop: 25}}>
            <Sponsor.COOLDown big={big} />
            <Sponsor.Geniaal big={big} style={{marginLeft: 20}} />
            <Sponsor.TuinenRottiers big={big} style={{marginLeft: 20}} />
          </div>
        </Row>
      );
    }

    return (
      <Row style={{margin: 10}}>
        <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
        <Col style={{marginTop: 20}}>
          <Sponsor.AcademicSoftware big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.itenium big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.RdInterieur big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.BeSure2 big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.Woodchuck big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.Bordman big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.RJConstruct big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.EcoProject big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.COOLDown big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.Geniaal big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.TuinenRottiers big={big} />
        </Col>
      </Row>
    );
  }
}

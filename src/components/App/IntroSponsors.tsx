import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PropTypes, {connect, withViewport, withContext} from '../PropTypes';
import {Strike} from '../controls';
import * as Sponsor from './Sponsors';


class IntroSponsors extends Component {
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
            <Sponsor.SlagerijGuy big={big} />
            <Sponsor.itenium big={big} />
            <Sponsor.Nostech big={big} style={{marginLeft: 20}} />
          </div>
          <div style={{width: 770, margin: 'auto', paddingTop: 25}}>
            <Sponsor.TransformerService big={big} />
            <Sponsor.RdInterieur big={big} style={{marginLeft: 20}} />
            <Sponsor.BeSure2 big={big} style={{marginLeft: 20}} />
          </div>
        </Row>
      );
    }

    return (
      <Row style={{margin: 10}}>
        <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
        <Col style={{marginTop: 20}}>
          <Sponsor.SlagerijGuy big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.itenium big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.Nostech big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.TransformerService big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.RdInterieur big={big} />
        </Col>
        <Col style={{marginTop: 20}}>
          <Sponsor.BeSure2 big={big} />
        </Col>
      </Row>
    );
  }
}

export default withViewport(withContext(IntroSponsors));

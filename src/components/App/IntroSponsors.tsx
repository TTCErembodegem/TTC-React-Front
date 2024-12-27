import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Strike } from '../controls/controls/Strike';
import * as Sponsor from './Sponsors';
import { useViewport } from '../../utils/hooks/useViewport';
import { t } from '../../locales';

export const IntroSponsors = () => {
  const viewport = useViewport();
  const big = viewport.width > 830;
  if (big) {
    return (
      <Row style={{marginTop: 25, marginBottom: 15}}>
        <div style={{width: 770, margin: 'auto'}}>
          <Strike text={t('intro.ourSponsors')} style={{marginBottom: 5}} />
          <Sponsor.AcademicSoftware big={big} />
          <Sponsor.Itenium big={big} style={{marginLeft: 20}} />
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
      <Strike text={t('intro.ourSponsors')} style={{marginBottom: 5}} />
      <Col style={{marginTop: 20}}>
        <Sponsor.AcademicSoftware big={big} />
      </Col>
      <Col style={{marginTop: 20}}>
        <Sponsor.Itenium big={big} />
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
};

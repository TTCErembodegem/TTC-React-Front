import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';
import { OwnEmail, GoogleMap } from '../controls.js';

const clubBankNr = 'BE55 0016 5927 6744';
const clubOrgNr = 'BE 0840.545.283';
const compBalls = 'Xushaofa tt-bal 3-ster SYNTH 40 mm';

export default class GeneralInfo extends Component {
  static contextTypes = PropTypes.contextTypes;
  render() {
    return (
      <div style={{marginTop: 10, marginBottom: 10}}>
        <h2>{this.context.t('clubs.generalInfo.title')}</h2>
        <div className="row">
          <div className="col-md-6">
            <h1>{this.context.t('clubs.generalInfo.contact')}</h1>
            <strong>{this.context.t('clubs.generalInfo.ourAddress')}</strong> {this.context.t('footer.location')}
            <div><strong>{this.context.t('clubs.generalInfo.ourEmail')}</strong> <OwnEmail /></div>
            <strong>{this.context.t('clubs.generalInfo.orgNr')}</strong> {clubOrgNr}<br />

            <h1>{this.context.t('clubs.generalInfo.openDays')}</h1>
            {this.context.t('footer.competitionDays')}
            <br />
            {this.context.t('footer.trainingDays')}
            <br /><br />
            <strong>VTTL</strong> OVL134<br />
            <strong>Sporta</strong> 4055<br />
            <br />
            <strong>{this.context.t('clubs.generalInfo.balls')}</strong><br />
            {compBalls}<br />


            <h1>{this.context.t('clubs.generalInfo.moneyMoney')}</h1>
            {this.context.t('footer.adultMembership')}
            <br />
            {this.context.t('footer.youthMembership')}
            <div style={{marginTop: 16, fontSize: 12}}>{this.context.t('footer.additionalMembership')}</div>
            <br />
            <strong>{this.context.t('clubs.generalInfo.bankNr')}</strong> {clubBankNr}<br />

          </div>
          <div className="col-md-6">
            <h1 className="visible-sm">{this.context.t('clubs.generalInfo.googleMap')}</h1>
            <GoogleMap />
          </div>
        </div>
      </div>
    );
  }
}

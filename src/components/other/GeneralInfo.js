import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';
import { OwnEmail, GoogleMap } from '../controls.js';

const clubBankNr = 'BE55 0016 5927 6744';
const clubOrgNr = 'BE 0840.545.283';

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

            <h1>{this.context.t('clubs.generalInfo.openDays')}</h1>
            {this.context.t('footer.competitionDays')}
            <br />
            {this.context.t('footer.trainingDays')}

            <h1>{this.context.t('clubs.generalInfo.moneyMoney')}</h1>
            <strong>{this.context.t('clubs.generalInfo.bankNr')}</strong> {clubBankNr}<br />
            {this.context.t('footer.adultMembership')}
            <br />
            {this.context.t('footer.youthMembership')}

            <h1>{this.context.t('clubs.generalInfo.other')}</h1>
            <strong>VTTL</strong> OVL134<br />
            <strong>Sporta</strong> 4055<br />
            <strong>{this.context.t('clubs.generalInfo.orgNr')}</strong> {clubOrgNr}<br />


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

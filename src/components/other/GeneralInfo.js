import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import {OwnEmail, GoogleMap} from '../controls.js';
import ClubLocationInstructions from './ClubLocationInstructions.js';


@connect(state => ({params: state.config.get('params')}))
export default class GeneralInfo extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div style={{marginTop: 10, marginBottom: 10}}>
        <h2>{this.context.t('clubs.generalInfo.title')}</h2>
        <div className="row">
          <div className="col-md-6">
            <ClubLocationInstructions />

            <h1>{this.context.t('clubs.generalInfo.contact')}</h1>
            <strong>{this.context.t('clubs.generalInfo.ourAddress')}</strong> {this.props.params.location}
            <div><strong>{this.context.t('clubs.generalInfo.ourEmail')}</strong> <OwnEmail /></div>
            <strong>{this.context.t('clubs.generalInfo.orgNr')}</strong> {this.props.params.clubOrgNr}<br />

            <h1>{this.context.t('clubs.generalInfo.openDays')}</h1>
            {this.props.params.competitionDays}
            <br />
            {this.props.params.trainingDays}
            <br />{this.context.t('clubs.training.trainingDays2')}
            <br />{this.context.t('clubs.training.trainingDays3')}
            <br /><br />{this.context.t('clubs.training.extra')}
            <br /><br />
            <strong>VTTL</strong> {this.props.params.frenoyClubIdVttl}<br />
            <strong>Sporta</strong> {this.props.params.frenoyClubIdSporta}<br />
            <br />
            <strong>{this.context.t('clubs.generalInfo.balls')}</strong><br />
            {this.props.params.compBalls}<br />


            <h1>{this.context.t('clubs.generalInfo.moneyMoney')}</h1>
            {this.props.params.adultMembership}
            <br />
            {this.props.params.youthMembership}
            <br />
            {this.props.params.recreationalMembers}

            <div style={{marginTop: 16, fontSize: 12}}>{this.props.params.additionalMembership}</div>

            <br />
            <strong>{this.context.t('clubs.generalInfo.bankNr')}</strong> {this.props.params.clubBankNr}<br />

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

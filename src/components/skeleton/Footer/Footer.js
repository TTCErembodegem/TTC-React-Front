import React, { Component } from 'react';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import styles from './Footer.css';
import withViewport from '../../../utils/decorators/withViewport.js';
import withStyles from '../../../utils/decorators/withStyles.js';

import Icon from '../../controls/Icon';

@withViewport
@withStyles(styles)
export default class Footer extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div className="Footer">
        <div className="Footer-container">
          <div className="col-xs-2 col-lg-1"><Icon fa="fa fa-map-marker" /></div>
          <div className="col-xs-13 col-lg-5 text">{this.context.t('footer.location')}</div>
          <div className="col-xs-2 col-lg-1"><Icon fa="fa fa-calendar" /></div>
          <div className="col-xs-13 col-lg-5 text">{this.context.t('footer.trainingDays')}</div>
          <div className="col-xs-2 col-lg-1 col-lg-push-6"><Icon fa="fa fa-calendar" /></div>
          <div className="col-xs-13 col-lg-5 col-lg-push-6 text">{this.context.t('footer.competitionDays')}</div>
          <div className="col-xs-2 col-lg-1 col-lg-pull-6" ><Icon fa="fa fa-envelope-o" /></div>
          <div className="col-xs-13 col-lg-5 col-lg-pull-6 text"><a href="mailto:info@ttc-erembodegem.be">
            {this.context.t('footer.contact')}</a>
          </div>
          <div className="col-xs-2 col-lg-1"><Icon fa="fa fa-phone" /></div>
          <div className="col-xs-13 col-lg-5 text">{this.context.t('footer.telephoneNumber')}</div>
          <div className="col-xs-0"></div>
          <div className="col-xs-2 col-lg-1"><Icon fa="fa fa-eur" /></div>
          <div className="col-xs-13 col-lg-5 text">{this.context.t('footer.adultMembership')}</div>
          <div className="col-xs-0 col-lg-6 text"></div>
          <div className="col-xs-2 col-lg-1"><Icon fa="fa fa-eur" /></div>
          <div className="col-xs-13 col-lg-5 text">{this.context.t('footer.youthMembership')}</div>
        </div>
      </div>
    );
  }
}
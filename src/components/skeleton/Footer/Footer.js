import React, {Component} from 'react';

import {contextTypes} from '../../../utils/decorators/withContext.js';
import styles from './Footer.css';
import withStyles from '../../../utils/decorators/withStyles.js';
import {Icon, OwnEmail} from '../../controls.js';
import {CookieNotice} from './CookieNotice.js';

@withStyles(styles)
export default class Footer extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div className="Footer">
        <div className="Footer-container">
          <div className="col-xs-2 col-sm-1"><Icon fa="fa fa-map-marker" /></div>
          <div className="col-xs-13 col-sm-5 Footer-text">{this.context.t('footer.location')}</div>
          <div className="col-xs-2 col-sm-1"><Icon fa="fa fa-calendar" /></div>
          <div className="col-xs-13 col-sm-5 Footer-text">{this.context.t('footer.trainingDays')}</div>
          <div className="col-xs-2 col-sm-1 col-sm-push-6">&nbsp;</div>
          <div className="col-xs-13 col-sm-5 col-sm-push-6 Footer-text">{this.context.t('footer.competitionDays')}</div>
          <div className="col-xs-2 col-sm-1 col-sm-pull-6" ><Icon fa="fa fa-envelope-o" /></div>
          <div className="col-xs-13 col-sm-5 col-sm-pull-6 Footer-text">
            <OwnEmail className="Footer-link" />
          </div>
        </div>
        <CookieNotice />
      </div>
    );
  }
}

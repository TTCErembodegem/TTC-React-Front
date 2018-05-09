import React, {Component} from 'react';
import {contextTypes} from '../../../utils/decorators/withContext.js';
import styles from './CookieNotice.css';
import withStyles from '../../../utils/decorators/withStyles.js';

@withStyles(styles)
export class CookieNotice extends Component {
  static contextTypes = contextTypes;

  render() {
    const {t} = this.context;
    if (localStorage.getItem('cookieNoticeKilled')) {
      return null;
    }

    return (
      <div className="cookie-notice">
        {t('footer.cookieNotice')}
        <u
          className="clickable"
          style={{marginLeft: 8}}
          onClick={() => this._killCookieNotice()}
        >
          {t('footer.cookieNoticeClose')}
        </u>
      </div>
    );
  }

  _killCookieNotice() {
    localStorage.setItem('cookieNoticeKilled', true);
    this.forceUpdate();
  }
}

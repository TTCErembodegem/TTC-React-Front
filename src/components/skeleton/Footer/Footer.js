import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import {Icon, OwnEmail} from '../../controls.js';
import {CookieNotice} from './CookieNotice.js';

import './Footer.css';

class Footer extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <MadeBy />

        <div className="Footer">
          <div className="Footer-container">
            <div className="col-xs-2 col-sm-1"><Icon fa="fa fa-map-marker" /></div>
            <div className="col-xs-13 col-sm-5 Footer-text">{this.props.params.location}</div>
            <div className="col-xs-2 col-sm-1"><Icon fa="fa fa-calendar" /></div>
            <div className="col-xs-13 col-sm-5 Footer-text">{this.props.params.trainingDays}</div>
            <div className="col-xs-2 col-sm-1">&nbsp;</div>
            <div className="col-xs-13 col-sm-5 Footer-text">{this.props.params.competitionDays}</div>
            <div className="col-xs-2 col-sm-1" ><Icon fa="fa fa-envelope-o" /></div>
            <div className="col-xs-13 col-sm-5 Footer-text">
              <OwnEmail className="Footer-link" />
            </div>
          </div>
          <CookieNotice />
        </div>
      </div>
    );
  }
}

export default connect(state => ({params: state.config.get('params')}))(Footer);

class MadeBy extends Component {
  render() {
    const style = {
      float: 'right',
      marginRight: 20
    };
    return (
      <div>
        <div style={style}>by <a href="https://itenium.be" target="_blank">itenium</a></div>
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

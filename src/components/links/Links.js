import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';

import { contextTypes } from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './Links.css';
import withViewport from '../../utils/decorators/withViewport.js';

@withViewport
@withStyles(styles)
export default class Links extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div>
        <table className="table table-striped table-bordered table-hover">
          <tbody>
            <tr className="info">
              <td className="tableHeader">{this.context.t('links.federations')}</td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.vttl.be" target="_blank">{this.context.t('links.vttl')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.ovl.vttl.be/" target="_blank">{this.context.t('links.vttlovl')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.sportafederatie.be/tafeltennis" target="_blank">{this.context.t('links.sporta')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.ittf.com/" target="_blank">{this.context.t('links.ittf')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://competitie.vttl.be/index.php?menu=0" target="_blank">{this.context.t('links.vttlResults')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://tafeltennis.sporcrea.be/competitie/index.php" target="_blank">{this.context.t('links.sportaResults')}</a></td>
            </tr>
          </tbody>
        </table>
        <br />
        <table className="table table-striped table-bordered table-hover">
          <tbody>
            <tr className="info">
              <td className="tableHeader">{this.context.t('links.varia')}</td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://ttcsintpauwels.be/competitie/vttl/bereken-je-klassement/" target="_blank">{this.context.t('links.vttlCalculation')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://ttcsintpauwels.be/competitie/sporta/bereken-je-klassement/" target="_blank">{this.context.t('links.sportaCalculation')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.tafeltennisshop.be/" target="_blank">{this.context.t('links.francis')}</a></td>
            </tr>
            <tr>
              <td><a className="linksText" href="http://www.tafeltennisactua.be/" target="_blank">{this.context.t('links.ttactua')}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
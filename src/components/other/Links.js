import React, {Component} from 'react';
import {contextTypes} from '../../utils/decorators/withContext.js';

export default class Links extends Component {
  static contextTypes = contextTypes;

  render() {
    return (
      <div style={{marginTop: 10}}>
        <table className="table table-striped table-bordered table-hover">
          <tbody>
            <tr className="info">
              <td className="tableHeader">{this.context.t('links.federations')}</td>
            </tr>
            <tr>
              <td><a href="https://www.vttl.be" target="_blank">{this.context.t('links.vttl')}</a></td>
            </tr>
            <tr>
              <td><a href="http://www.ovl.vttl.be/" target="_blank">{this.context.t('links.vttlovl')}</a></td>
            </tr>
            <tr>
              <td><a href="http://www.sportafederatie.be/tafeltennis" target="_blank">{this.context.t('links.sporta')}</a></td>
            </tr>
            <tr>
              <td><a href="https://www.ittf.com/" target="_blank">{this.context.t('links.ittf')}</a></td>
            </tr>
            <tr>
              <td><a href="https://www.ettu.org/" target="_blank">{this.context.t('links.ettu')}</a></td>
            </tr>
            <tr>
              <td><a href="https://competitie.vttl.be/index.php?menu=0" target="_blank">{this.context.t('links.vttlResults')}</a></td>
            </tr>
            <tr>
              <td><a href="https://ttonline.sporta.be/competitie/index.php" target="_blank">{this.context.t('links.sportaResults')}</a></td>
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
              <td>
                <a href="https://ttcsintpauwels.be/competitie/vttl/bereken-je-klassement/" target="_blank">
                  {this.context.t('links.vttlCalculationOne')}
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://ttcsintpauwels.be/competitie/sporta/bereken-je-klassement/" target="_blank">
                  {this.context.t('links.sportaCalculation')}
                </a>
              </td>
            </tr>
            <tr>
              <td><a href="https://www.best-tts.be/Store" target="_blank">{this.context.t('links.besttts')}</a></td>
            </tr>
            <tr>
              <td><a href="https://www.tabletennisdaily.co.uk/" target="_blank">{this.context.t('links.tabletennisDaily')}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

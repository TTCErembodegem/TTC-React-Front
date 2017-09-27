import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import TextField from 'material-ui/TextField';
import {ExcelButton} from '../../controls.js';

export class PlayersToolbar extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    marginLeft: PropTypes.number.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  render() {
    const {marginLeft, onFilterChange} = this.props;
    return (
      <div style={{marginRight: 5, marginLeft: marginLeft}}>
        <TextField
          hintText={this.context.t('players.search')}
          onChange={e => onFilterChange(e.target.value.toLowerCase())}
          style={{width: 150}} />

          <ExcelButton
            onClick={() => http.download.playersExcel(this.context.t('players.downloadExcelFileName'))}
            tooltip={this.context.t('players.downloadExcel')}
            className="pull-right"
            style={{marginTop: 5}}
          />
      </div>
    );
  }
}

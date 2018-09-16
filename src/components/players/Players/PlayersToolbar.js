import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import http from '../../../utils/httpClient.js';
import TextField from '@material-ui/core/TextField';
import {ExcelButton, SortIconDropDown} from '../../controls.js';

export class PlayersToolbar extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    marginLeft: PropTypes.number.isRequired,
    onFilterChange: PropTypes.func.isRequired,

    canSort: PropTypes.bool,
    activeSort: PropTypes.string.isRequired,
    activeSortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSortChange: PropTypes.func.isRequired,
    onSortDirectionChange: PropTypes.func.isRequired,
  };

  render() {
    const t= this.context.t;
    const {marginLeft, onFilterChange} = this.props;

    const sortConfig = [
      {key: 'name', text: t('player.sort.name')},
      {key: 'Vttl', text: t('player.sort.vttl')},
      {key: 'Sporta', text: t('player.sort.sporta')},
    ];

    return (
      <div style={{marginRight: 5, marginLeft: marginLeft, marginBottom: 5}}>
        <TextField
          hintText={this.context.t('players.search')}
          onChange={e => onFilterChange(e.target.value.toLowerCase())}
          style={{width: 150}}
        />

        <div className="button-bar-right" style={{marginTop: 5}}>
          {this.props.canSort ? (
            <SortIconDropDown
              config={sortConfig}
              activeSort={this.props.activeSort}
              activeSortDirection={this.props.activeSortDirection}
              onSortChange={newSort => this.props.onSortChange(newSort)}
              onSortDirectionChange={newDir => this.props.onSortDirectionChange(newDir)}
            />
          ) : null}

          <ExcelButton
            onClick={() => http.download.playersExcel(this.context.t('players.downloadExcelFileName'))}
            tooltip={this.context.t('players.downloadExcel')}
          />
        </div>
      </div>
    );
  }
}

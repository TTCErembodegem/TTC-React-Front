import React, {Component} from 'react';
import Select from 'react-select';
import PropTypes, {connect} from '../PropTypes';
import {IPlayer, Competition} from '../../models/model-interfaces';

type PlayerAutoCompleteProps = {
  players: IPlayer[];
  selectPlayer: (playerId: number) => void;
  clearOnSelect: Function;
  competition: Competition;
}

type PlayerAutoCompleteState = {
  searchText: null | string;
}

class PlayerAutoComplete extends Component<PlayerAutoCompleteProps, PlayerAutoCompleteState> {
  static contextTypes = PropTypes.contextTypes;

  static defaultProps = {
    clearOnSelect: false,
  }

  constructor(props) {
    super(props);
    this.state = {searchText: null};
  }

  _onPlayerSelected(option) {
    if (!option.length) {
      this.setState({searchText: option});
      this.props.selectPlayer(option.value);
    }
  }

  render() {
    const {players, selectPlayer, dispatch, clearOnSelect, competition, label, style, ...props} = this.props; // eslint-disable-line
    let filteredPlayers = players;
    if (competition) {
      filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
    }
    const playerMenuItems = filteredPlayers.map(ply => ({
      value: ply.id,
      label: ply.name + (competition ? ` (${ply[competition.toLowerCase()].ranking})` : ''),
    }));
    const systemPlayerItem = {value: 'system', label: 'Systeem'};

    return (
      <div style={{...style, overflow: 'visible'}}>
        <Select
          value={this.state.searchText}
          placeholder={label}
          {...props}
          onChange={this._onPlayerSelected.bind(this)}
          options={playerMenuItems.concat([systemPlayerItem]).sort((a, b) => a.label.localeCompare(b.label)).toArray()}
          isClearable={false}
          maxMenuHeight={200}
          noOptionsMessage={() => this.context.t('players.noFound')}
          openMenuOnFocus={false}
          openMenuOnClick={false}
        />
      </div>
    );
  }
}

export default connect(state => ({players: state.players}))(PlayerAutoComplete);

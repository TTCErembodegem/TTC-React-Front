import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';

import Select from 'react-select';
// import MenuItem from '@material-ui/core/MenuItem';

@connect(state => ({players: state.players}))
export default class PlayerAutoComplete extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    selectPlayer: PropTypes.func.isRequired,
    clearOnSelect: PropTypes.bool,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']),
  }
  static defaultProps = {
    clearOnSelect: false
  }
  constructor() {
    super();
    this.state = {searchText: null};
  }

  _onPlayerSelected(option) {
    console.log('AutoComplete::_onPlayerSelected', option);
    if (!option.length) {
      // const player = this.props.players.find(ply => ply.id === option.value);
      this.setState({searchText: option});
      this.props.selectPlayer(option.value);
    }

    // TODO: how to select system?
    // this.props.selectPlayer('system');
  }

  render() {
    const {players, selectPlayer, dispatch, clearOnSelect, competition, label, ...props} = this.props; // eslint-disable-line
    var filteredPlayers = players;
    if (competition) {
      filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
    }
    const playerMenuItems = filteredPlayers.map(ply => ({
      value: ply.id,
      label: ply.name,
      // value: <MenuItem secondaryText={competition ? ply[competition.toLowerCase()].ranking : undefined}>{ply.name}</MenuItem>,
    }));

    return (
      <Select
        value={this.state.searchText}
        placeholder={label}
        {...props}
        onChange={this._onPlayerSelected.bind(this)}
        options={playerMenuItems.sort((a, b) => a.label.localeCompare(b.label)).toArray()}
        isClearable={false}
        maxMenuHeigh={100}
        noOptionsMessage={() => this.context.t('players.noFound')}
      />
    );
  }
}

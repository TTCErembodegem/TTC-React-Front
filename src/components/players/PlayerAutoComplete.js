import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import Select from 'react-select';

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
    if (!option.length) {
      this.setState({searchText: option});
      this.props.selectPlayer(option.value);
    }
  }

  render() {
    const {players, selectPlayer, dispatch, clearOnSelect, competition, label, ...props} = this.props; // eslint-disable-line
    var filteredPlayers = players;
    if (competition) {
      filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
    }
    const playerMenuItems = filteredPlayers.map(ply => ({
      value: ply.id,
      label: ply.name + (competition ? ' (' + ply[competition.toLowerCase()].ranking + ')' : ''),
    }));
    const systemPlayerItem = {value: 'system', label: 'Systeem'};

    return (
      <Select
        value={this.state.searchText}
        placeholder={label}
        {...props}
        onChange={this._onPlayerSelected.bind(this)}
        options={playerMenuItems.concat([systemPlayerItem]).sort((a, b) => a.label.localeCompare(b.label)).toArray()}
        isClearable={false}
        maxMenuHeigh={100}
        noOptionsMessage={() => this.context.t('players.noFound')}
      />
    );
  }
}

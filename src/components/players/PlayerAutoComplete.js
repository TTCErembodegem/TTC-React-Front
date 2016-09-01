import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

@connect(state => {
  return {
    players: state.players,
  };
})
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
    this.state = {searchText: ''};
  }

  _onPlayerSelected(stateAction, text) {
    if (typeof text === 'object') {
      text = text.text;
    }
    if (stateAction === 'clear' && this.props.clearOnSelect) {
      this.setState({searchText: ''});
    } else {
      this.setState({searchText: text});
    }

    if (text) {
      const matchedPlayers = this.props.players.filter(ply => ply.name.toUpperCase() === text.toUpperCase() || ply.alias.toUpperCase() === text.toUpperCase());
      if (matchedPlayers.size === 1) {
        this.props.selectPlayer(matchedPlayers.first().id);
      } else if (text.toLowerCase() === 'system' || text.toLowerCase() === 'systeem') {
        this.props.selectPlayer('system');
      }
    }
  }

  render() {
    const { players, selectPlayer, dispatch, clearOnSelect, competition, ...props } = this.props;
    var filteredPlayers = players;
    if (competition) {
      filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
    }
    const playerMenuItems = filteredPlayers.map(ply => ({
      text: ply.name,
      value: <MenuItem primaryText={ply.name} />,
    }));
    const aliases = filteredPlayers.filter(ply => ply.name.indexOf(ply.alias) === -1).map(ply => ({
      text: ply.alias,
      value: <MenuItem primaryText={ply.alias} />,
    }));


    return (
      <AutoComplete
        filter={::this._filter}
        searchText={this.state.searchText}
        {...props}
        onNewRequest={this._onPlayerSelected.bind(this, 'clear')}
        onUpdateInput={this._onPlayerSelected.bind(this, 'update')}
        dataSource={playerMenuItems.concat(aliases).sort((a, b) => a.text.localeCompare(b.text)).toArray()} />
    );
  }

  _filter(searchText, personName) {
    if (!searchText) {
      return false;
    }

    searchText = searchText.toLowerCase();
    const lastName = personName.toLowerCase().substring(0, personName.lastIndexOf(' '));
    const firstName = personName.toLowerCase().substring(personName.lastIndexOf(' ') + 1);
    return firstName.indexOf(searchText) === 0 || lastName.indexOf(searchText) === 0;
  }
}
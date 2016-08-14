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
  }

  _onPlayerSelected(text) {
    if (typeof text === 'object') {
      text = text.text;
    }
    if (text) {
      const matchedPlayers = this.props.players.filter(ply => ply.alias.toUpperCase() === text.toUpperCase());
      if (matchedPlayers.size === 1) {
        this.props.selectPlayer(matchedPlayers.first().id);
      } else if (text.toLowerCase() === 'system' || text.toLowerCase() === 'systeem') {
        this.props.selectPlayer('system');
      }
    }
  }

  render() {
    const { players, selectPlayer, dispatch, ...props } = this.props;
    const playerMenuItems = players.map(ply => ({
      text: ply.alias,
      value: <MenuItem primaryText={ply.alias} />,
    }));

    return (
      <AutoComplete
        filter={AutoComplete.fuzzyFilter}
        {...props}
        onNewRequest={::this._onPlayerSelected}
        onUpdateInput={::this._onPlayerSelected}
        dataSource={playerMenuItems.toArray()} />
    );
  }
}
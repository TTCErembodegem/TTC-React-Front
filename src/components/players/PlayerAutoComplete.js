import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
    const players = this.props.players.map(ply => ({
      text: ply.alias,
      value: <MenuItem primaryText={ply.alias} />,
    }));

    return (
      <AutoComplete
        filter={AutoComplete.fuzzyFilter}
        triggerUpdateOnFocus={false}
        {...this.props}
        onNewRequest={::this._onPlayerSelected}
        onUpdateInput={::this._onPlayerSelected}
        dataSource={players.toArray()} />
    );
  }
}
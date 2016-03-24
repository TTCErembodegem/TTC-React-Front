import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { contextTypes } from '../../utils/decorators/withContext.js';
import { connect } from 'react-redux';

import PlayerModel from '../../models/PlayerModel.js';

import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

@connect(state => {
  return {
    players: state.players,
  };
})
export default class PlayerAutoComplete extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  _onPlayerSelected(text) {
    if (text) {
      var matchedPlayers = this.props.players.filter(ply => ply.alias.toUpperCase() === text.toUpperCase());
      if (matchedPlayers.size === 1) {
        this.props.selectPlayer(matchedPlayers.first().id);
      } else if (text === 'system') {
        this.props.selectPlayer('system');
      }
    }
  }

  render() {
    var players = this.props.players.map(ply => ({
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
import React, {Component} from 'react';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';
import PropTypes, {connect} from '../../PropTypes';

import PlayerAutoComplete from '../../players/PlayerAutoComplete';
import PlayerAvatar from '../../players/PlayerAvatar';

import * as matchActions from '../../../actions/matchActions';
import {getPlayingStatusColor} from '../../../models/PlayerModel';

class SelectPlayersForm extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    match: PropTypes.MatchModel.isRequired,
    user: PropTypes.UserModel.isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  render() {
    const team = this.props.match.getTeam();
    let reservePlayers = team.getPlayers('reserve');

    // Add one time team players
    const selectedFromTeam = team.getPlayers().map(ply => ply.player.id);
    const otherSelectedPlayers = this.props.match.getOwnPlayerModels('onlyFinal')
      .filter(ply => selectedFromTeam.indexOf(ply.id) === -1)
      .map(ply => ({
        player: ply,
        type: 'Invaller',
      }));
    reservePlayers = reservePlayers.concat(otherSelectedPlayers.toArray());

    return (
      <div>
        <PlayerAvatarList players={team.getPlayers('standard')} match={this.props.match} selectPlayer={this.props.selectPlayer} />
        {reservePlayers.length ? <Divider /> : null}
        {reservePlayers.length ? <PlayerAvatarList players={reservePlayers} match={this.props.match} selectPlayer={this.props.selectPlayer} /> : null}
        <Divider />
        <PlayerAutoComplete
          clearOnSelect
          selectPlayer={this.props.selectPlayer.bind(this, this.props.match.id, this.props.match.block || 'Captain', null)}
          style={{marginTop: 15, marginLeft: 15, marginRight: 15}}
          placeholder={this.context.t('match.chooseOtherPlayer')}
          competition={team.competition}
        />
      </div>
    );
  }
}


class PlayerAvatarList extends Component {
  static propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
      player: PropTypes.PlayerModel.isRequired,
      type: PropTypes.oneOf(['Standard', 'Captain', 'Reserve', 'Invaller']).isRequired,
    })),
    match: PropTypes.MatchModel.isRequired,
    selectPlayer: PropTypes.func.isRequired,
  }

  render() {
    return (
      <List>
        {this.props.players.map(({player/* , type */}) => (
          <SelectableMatchPlayerAvatar
            player={player}
            select={this._onPlayerSelect.bind(this, player.id)}
            match={this.props.match}
            key={player.id}
          />
        ))}
      </List>
    );
  }

  _onPlayerSelect(playerId) {
    this.props.selectPlayer(this.props.match.id, this.props.match.block || 'Captain', null, playerId);
  }
}

const SelectableMatchPlayerAvatar = ({match, player, select}) => {
  const matchPlayer = match.plays(player, 'onlyFinal');
  const color = getPlayingStatusColor(matchPlayer);
  if (select) {
    return <SelectablePlayerAvatar player={player} select={select} backgroundColor={color} />;
  }
  return <PlayerAvatar player={player} backgroundColor={color} />;
};

class SelectablePlayerAvatar extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    select: PropTypes.func.isRequired,
    backgroundColor: PropTypes.string,
  }

  render() {
    const {player} = this.props;
    return (
      <ListItem button onClick={this.props.select}>
        <ListItemIcon>
          <Avatar style={{backgroundColor: this.props.backgroundColor, fontWeight: 'bold', color: 'white'}}>{player.alias[0]}</Avatar>
        </ListItemIcon>
        <ListItemText primary={player.alias} secondary={player.contact.getMobile()} />
      </ListItem>
    );
  }
}

SelectableMatchPlayerAvatar.propTypes = {
  match: PropTypes.MatchModel.isRequired,
  player: PropTypes.PlayerModel.isRequired,
  select: PropTypes.func.isRequired,
};

export default connect(state => ({
  players: state.players,
}), matchActions)(SelectPlayersForm);

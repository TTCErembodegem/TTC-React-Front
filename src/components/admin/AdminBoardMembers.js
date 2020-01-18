import React, {Component} from 'react';
import PropTypes, {connect, storeUtil} from '../PropTypes.js';
import * as playerActions from '../../actions/playerActions.js';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

// ATTN: This corresponds to an enum in the backend: ClubManagerType
const clubManagerTypes = [
  {key: 0, text: 'Default'},
  {key: 1, text: 'Chairman'},
  {key: 2, text: 'Secretary'},
  {key: 3, text: 'Treasurer'},
  {key: 4, text: 'Vttl'},
  {key: 5, text: 'Sporta'},
];

class AdminBoardMembers extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    saveBoardMember: PropTypes.func.isRequired,
    deleteBoardMember: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      boardFunction: 0,
      sort: 10,
    };
  }

  playerSelected(playerId) {
    const club = storeUtil.getOwnClub();
    let boardFunction = '';
    let sort = '';
    if (club) {
      const manager = club.managers.find(x => x.playerId === playerId);
      if (manager) {
        boardFunction = manager.description;
        sort = manager.sortOrder;
      }
    }
    this.setState({playerId, boardFunction, sort});
  }

  render() {
    const paperStyle = {
      marginLeft: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('clubs.managementTitle')}</h3>
        <PlayerAutoComplete
          selectPlayer={playerId => this.playerSelected(playerId)}
          placeholder={this.context.t('login.loginName')}
        />

        <br />
        Moet "Bestuurslid" expliciet kiezen of het werkt niet.
        <br />(sortering waarschijnlijk ook😃)
        <br />

        <DropdownButton
          title={this.context.t('clubs.managerTypes.' + (clubManagerTypes.find(x => x.text === this.state.boardFunction) || {text: 'Default'}).text)}
          id="boardFunction"
          bsSize="large"
        >
          {clubManagerTypes.map(button => (
            <MenuItem eventKey={button.key} key={button.key} onSelect={() => this.setState({boardFunction: button.text})}>
              {this.context.t('clubs.managerTypes.' + button.text)}
            </MenuItem>
          ))}
        </DropdownButton>

        <br />
        <br />

        <TextField
          label={this.context.t('admin.board.sort')}
          type="number"
          onChange={e => this.setState({sort: e.target.value})}
          value={this.state.sort}
        />

        <br />

        <MaterialButton variant="contained"
          label={this.context.t('admin.board.save')}
          style={{marginTop: 15, marginRight: 8}}
          onClick={() => this.props.saveBoardMember(this.state)}
          disabled={!this.state.playerId}
        />

        <MaterialButton variant="contained"
          label={this.context.t('admin.board.del')}
          style={{marginTop: 15}}
          onClick={() => this.props.deleteBoardMember(this.state)}
          disabled={!this.state.playerId}
        />
      </div>
    );
  }
}

export default connect(state => ({clubs: state.clubs}), playerActions)(AdminBoardMembers);

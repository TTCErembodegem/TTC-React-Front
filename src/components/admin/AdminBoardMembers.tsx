import React, {Component} from 'react';
import TextField from '@mui/material/TextField';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PropTypes, {connect, storeUtil} from '../PropTypes';
import * as playerActions from '../../actions/playerActions';

import PlayerAutoComplete from '../players/PlayerAutoComplete';
import {MaterialButton} from '../controls/Buttons/MaterialButton';

// ATTN: This corresponds to an enum in the backend: ClubManagerType
const clubManagerTypes = [
  {key: 0, text: 'Default'},
  {key: 1, text: 'Chairman'},
  {key: 2, text: 'Secretary'},
  {key: 3, text: 'Treasurer'},
  {key: 4, text: 'Vttl'},
  {key: 5, text: 'Sporta'},
];

type AdminBoardMembersProps = {
  saveBoardMember: Function;
  deleteBoardMember: Function;
  onEnd: Function;
}

type AdminBoardMembersState = {
  playerId: null | number;
  boardFunction: string;
  sort: number;
}

class AdminBoardMembers extends Component<AdminBoardMembersProps, AdminBoardMembersState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {
      playerId: null,
      boardFunction: '',
      sort: 10,
    };
  }

  playerSelected(playerId: number) {
    const club = storeUtil.getOwnClub();
    let boardFunction = '';
    let sort = 0;
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
    const paperStyle: React.CSSProperties = {
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
        Moet &quot;Bestuurslid&quot; expliciet kiezen of het werkt niet.
        <br />(sortering waarschijnlijk ook😃)
        <br />

        <DropdownButton
          title={this.context.t(`clubs.managerTypes.${(clubManagerTypes.find(x => x.text === this.state.boardFunction) || {text: 'Default'}).text}`)}
          id="boardFunction"
          bsSize="large"
        >
          {clubManagerTypes.map(button => (
            <Dropdown.Item eventKey={button.key} key={button.key} onSelect={() => this.setState({boardFunction: button.text})}>
              {this.context.t(`clubs.managerTypes.${button.text}`)}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <br />
        <br />

        <TextField
          label={this.context.t('admin.board.sort')}
          type="number"
          onChange={e => this.setState({sort: parseInt(e.target.value, 0)})}
          value={this.state.sort}
        />

        <br />

        <MaterialButton
          variant="contained"
          label={this.context.t('admin.board.save')}
          style={{marginTop: 15, marginRight: 8}}
          onClick={() => this.props.saveBoardMember(this.state)}
          disabled={!this.state.playerId}
        />

        <MaterialButton
          variant="contained"
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

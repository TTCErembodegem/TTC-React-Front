import React, {Component} from 'react';
import PropTypes, {connect, storeUtil} from '../PropTypes.js';
import * as playerActions from '../../actions/playerActions.js';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';


const ManagerTypeOther = 'Other';
const clubManagerTypes = [
  {key: 0, text: 'Default'},
  {key: 1, text: 'Chairman'},
  {key: 2, text: 'Secretary'},
  {key: 3, text: 'Treasurer'},
  {key: 4, text: 'Vttl'},
  {key: 5, text: 'Sporta'},
  {key: 6, text: ManagerTypeOther},
];

@connect(state => ({clubs: state.clubs}), playerActions)
export default class AdminBoardMembers extends Component {
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
      boardFunctionCustom: '',
      sort: 10,
    };
  }

  playerSelected(playerId) {
    const club = storeUtil.getOwnClub();
    let boardFunction = '';
    let boardFunctionCustom = '';
    let sort = '';
    if (club) {
      const manager = club.managers.find(x => x.playerId === playerId);
      if (manager) {
        const isPredefinedFunction = clubManagerTypes.map(x => x.text).includes(manager.description);
        boardFunction = isPredefinedFunction ? manager.description : ManagerTypeOther;
        boardFunctionCustom = isPredefinedFunction ? '' : manager.description;
        sort = manager.sortOrder;
      }
    }
    this.setState({playerId, boardFunction, boardFunctionCustom, sort});
  }

  render() {
    const paperStyle = {
      marginLeft: 20,
      textAlign: 'center',
      display: 'inline-block',
      width: 500
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('clubs.managementTitle')}</h3>
        <PlayerAutoComplete
          selectPlayer={::this.playerSelected}
          placeholder={this.context.t('login.loginName')}
        />

        <br />
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

        <div>
          <br />
          <TextField
            label="Specifieke functie omschrijving"
            onChange={e => this.setState({boardFunctionCustom: e.target.value})}
            value={this.state.boardFunctionCustom}
          />
        </div>

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

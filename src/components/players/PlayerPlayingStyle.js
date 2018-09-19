import React, {Component} from 'react';
import PropTypes, {connect, withContext, storeUtil} from '../PropTypes.js';

import * as playerActions from '../../actions/playerActions.js';

import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';

import {EditIcon} from '../controls.js';
import PlayerAutoComplete from './PlayerAutoComplete.js';
import PlayerStyleAutocomplete from './PlayerStyleAutocomplete.js';
import PlayerAvatar from './PlayerAvatar.js';



export const PlayerPlayingStyle = ({ply, allowEdit = true}) => (
  <span>
    {allowEdit ? <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={{color: '#d3d3d3', float: 'right'}} /> : null}
    {ply.style.name}
    <br />
    <small>{ply.style.bestStroke}</small>
  </span>
);

PlayerPlayingStyle.propTypes = {
  ply: PropTypes.object.isRequired,
  allowEdit: PropTypes.bool,
};


@withStyles({dialog: {overflow: 'visible'}})
@connect(state => ({user: state.user}), playerActions)
@withContext
export class PlayerPlayingStyleForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    user: PropTypes.UserModel.isRequired,
    updateStyle: PropTypes.func.isRequired,
    iconStyle: PropTypes.oneOf(['avatar', 'edit-icon']).isRequired,
    style: PropTypes.object,
    classes: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      editingPlayer: null,
      newStyle: {name: '', bestStroke: ''},
      editingBy: null,
    };
  }

  _openStyle(ply) {
    this.setState({editingPlayer: ply, newStyle: Object.assign({}, ply.style), editingBy: storeUtil.getUser().playerId});
  }
  _closeStyle() {
    this.setState({editingPlayer: null, newStyle: {name: '', bestStroke: ''}});
  }
  _saveStyle() {
    this.props.updateStyle(this.state.editingPlayer, this.state.newStyle, this.state.editingBy);
    this._closeStyle();
  }

  _changeStyle(text) {
    this.setState({newStyle: Object.assign({}, this.state.newStyle, {name: text})});
  }
  _changeBestStroke(e) {
    this.setState({newStyle: Object.assign({}, this.state.newStyle, {bestStroke: e.target.value})});
  }
  _changePlayer(playerId) {
    this.setState({editingBy: playerId});
  }

  render() {
    const t = this.context.t;
    const ply = this.props.player;

    const canChangeStyle = this.props.user.playerId && this.props.user.playerId !== ply.id;
    if (!canChangeStyle) {
      return <div />;
    }

    var openFormIcon;
    if (this.props.iconStyle === 'avatar') {
      openFormIcon = (
        <div
          className="clickable"
          onClick={canChangeStyle ? this._openStyle.bind(this, ply) : undefined}
          style={{display: 'inline-block'}} title={t('player.editStyle.tooltip', ply.alias)}
        >
          <PlayerAvatar player={ply} style={{backgroundColor: 'gold', margin: 0}} />
        </div>
      );

    } else {
      openFormIcon = (
        <EditIcon
          tooltip={t('player.editStyle.tooltip', ply.alias)} tooltipPlacement="left"
          style={this.props.style}
          onClick={this._openStyle.bind(this, ply)}
        />
      );
    }


    if (!this.state.editingPlayer) {
      return openFormIcon;
    }

    const changeStyleModalActions = [
      <MaterialButton
        key="1"
        label={t('common.cancel')}
        secondary={true}
        onClick={::this._closeStyle}
      />,
      <MaterialButton
        key="2"
        label={t('common.save')}
        primary={true}
        onClick={::this._saveStyle}
      />,
    ];

    return (
      <Dialog
        open={!!this.state.editingPlayer}
        onClose={::this._closeStyle}
        scroll="body"
        classes={{paperScrollPaper: this.props.classes.dialog, paperScrollBody: this.props.classes.dialog}}
      >
        <DialogTitle className={this.props.classes.dialog}>{t('player.editStyle.title', this.props.player.alias)}</DialogTitle>

        <DialogContent className={this.props.classes.dialog}>
          <PlayerStyleAutocomplete t={t}
            value={this.state.newStyle.name || ''}
            onChange={::this._changeStyle}
          />

          <br />

          <TextField
            fullWidth
            label={t('player.editStyle.bestStroke')}
            type="text"
            value={this.state.newStyle.bestStroke || ''}
            onChange={::this._changeBestStroke}
          />

          <br />

          {this.props.user.isSystem() ? (
            <div style={{marginTop: 50}}>
              <PlayerAutoComplete
                selectPlayer={::this._changePlayer}
                label={t('system.playerSelect')}
              />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          {changeStyleModalActions}
        </DialogActions>
      </Dialog>
    );
  }
}

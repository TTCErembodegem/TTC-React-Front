import React, { Component } from 'react';
import PropTypes, { connect, withContext } from '../PropTypes.js';
import { util as storeUtil } from '../../store.js';

import * as playerActions from '../../actions/playerActions.js';
import { playerUtils } from '../../models/PlayerModel.js';

import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import Icon from '../controls/Icon.js';
import Telephone from '../controls/Telephone.js';
import PlayerPlayingStyle from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';
import PlayerAvatar from './PlayerAvatar.js';
import PlayerAutoComplete from './PlayerAutoComplete.js';
import PlayerStyleAutocomplete from './PlayerStyleAutocomplete.js';

const PlayersImageWidth = playerUtils.getPlayerImageSize().width + 30;
const PlayersImageHeight = playerUtils.getPlayerImageSize().height;
const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    marginBottom: -8
  },
};

const editStyleIcon = {
  position: 'absolute',
  top: 5,
  right: 5,
  color: '#d3d3d3',
};

@connect(() => ({}), playerActions)
@withContext
export default class PlayersImageGallery extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.oneOfType([
      PropTypes.PlayerModelList.isRequired,
      PropTypes.array.isRequired,
    ]),
    user: PropTypes.UserModel.isRequired,
    competition: PropTypes.competition.isRequired,
    viewport: PropTypes.viewport,
    updateStyle: PropTypes.func.isRequired,
    viewportWidthContainerCount: PropTypes.number.isRequired,
    subtitle: PropTypes.func,
  }
  static defaultProps = {
    viewportWidthContainerCount: 1 // The amount of containers next to eachother that display a PlayersImageGallery
  }

  constructor(props) {
    super(props);
    this.state = {
      editingPlayer: null,
      editingBy: null,
      newStyle: {
        name: '',
        bestStroke: ''
      }
    };
  }

  render() {
    const {players, user, competition, viewport} = this.props;
    const t = this.context.t;

    const changeStyleModalActions = [
      <FlatButton
        label={t('common.cancel')}
        secondary={true}
        onTouchTap={::this._closeStyle} />,
      <FlatButton
        label={t('common.save')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={::this._saveStyle} />,
    ];
    const selectedPlayer = this.state.editingPlayer;

    const playerPaperStyle = {
      height: 80,
      width: 150,
      margin: 5,
      display: 'inline-block',
      padding: 5,
    };

    var gallery;
    if (viewport.width > 600) {
      // big image gallery
      gallery = (
        <div style={gridStyles.root}>
          <GridList
            cellHeight={PlayersImageHeight}
            cols={Math.min(5, Math.floor((viewport.width / this.props.viewportWidthContainerCount) / PlayersImageWidth))}
            style={gridStyles.gridList}>
            {players.map(ply => {
              const comp = ply.getCompetition(competition);
              const canChangeStyle = user.playerId && user.playerId !== ply.id;
              return (
                <GridTile
                  key={ply.id}
                  title={(
                    <span>
                      <span>{ply.name}</span> <small>{comp ? comp.ranking : '??'}</small>
                    </span>
                  )}
                  subtitle={this.props.subtitle ? this.props.subtitle(ply) : <PlayerPlayingStyle ply={ply} />}>
                  {canChangeStyle ? (
                    <Icon
                      title={t('player.editStyle.tooltip', ply.alias)}
                      fa="fa fa-pencil-square-o"
                      style={editStyleIcon}
                      onClick={this._openStyle.bind(this, ply)} />
                  ) : null}
                  <PlayerImage playerId={ply.id} />
                </GridTile>
              );
            })}
          </GridList>
        </div>
      );
    } else {
      // small card gallery
      gallery = (
        <div style={{cursor: 'default'}}>
          {this.props.players.map(ply => {
            const comp = ply.getCompetition(competition);
            const canChangeStyle = user.playerId && user.playerId !== ply.id;
            return (
              <Paper key={ply.id} zDepth={1} style={playerPaperStyle}>
                <div
                  className="clickable"
                  onClick={canChangeStyle ? this._openStyle.bind(this, ply) : undefined}
                  style={{display: 'inline-block'}} title={t('player.editStyle.tooltip', ply.alias)}>
                  <PlayerAvatar player={ply} style={{backgroundColor: 'gold', margin: 0}} />
                </div>
                <strong style={{marginLeft: 5}}>{ply.alias}</strong> <small>{comp ? comp.ranking : '??'}</small>

                {user.playerId ? <Telephone number={ply.contact.mobile} style={{marginTop: 7}} /> : (
                  <p className="ellipsis" style={{marginTop: 7}}>{ply.style.name}</p>
                )}
              </Paper>
            );
          })}
        </div>
      );
    }

    return (
      <div>
        {gallery}
        {selectedPlayer ? (
          <Dialog
            title={t('player.editStyle.title', selectedPlayer.alias)}
            actions={changeStyleModalActions}
            bodyStyle={{minHeight: 145}}
            modal={false}
            open={!!this.state.editingPlayer}
            onRequestClose={::this._closeStyle}>

            <PlayerStyleAutocomplete t={t}
              value={this.state.newStyle.name || ''}
              onChange={::this._changeStyle} />

            <br />

            <TextField
              style={{marginBottom: -25}}
              floatingLabelText={t('player.editStyle.bestStroke')}
              type="text"
              value={this.state.newStyle.bestStroke}
              onChange={::this._changeBestStroke} />

            {user.isSystem() ? (
              <div>
                <PlayerAutoComplete
                  selectPlayer={::this._changePlayer}
                  floatingLabelText={t('system.playerSelect')} />
              </div>
            ) : null}
          </Dialog>
        ) : null}
      </div>
    );
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
}

export default PlayersImageGallery;
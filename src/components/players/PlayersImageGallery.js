import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import withContext, { contextTypes } from '../../utils/decorators/withContext.js';
import { util as storeUtil } from '../../store.js';

import * as playerActions from '../../actions/playerActions.js';
import { playerUtils } from '../../models/PlayerModel.js';

import List from 'material-ui/lib/lists/list';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Dialog from 'material-ui/lib/dialog';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';

import Icon from '../controls/Icon.js';
import Telephone from '../controls/Telephone.js';
import PlayerPlayingStyle from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';
import PlayerAvatar from './PlayerAvatar.js';
import PlayerAutoComplete from './PlayerAutoComplete.js';

const PlayersImageWidth = playerUtils.getPlayerImageSize().width;
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

@connect(state => {
  return {
    // config: state.config,
    // user: state.user,
  };
}, playerActions)
@withContext
export default class PlayersImageGallery extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    players: ImmutablePropTypes.list.isRequired,
    user: PropTypes.object.isRequired,
    competition: PropTypes.string.isRequired,
    viewport: PropTypes.object.isRequired,
    updateStyle: PropTypes.func.isRequired,
    viewportWidthContainerCount: PropTypes.number.isRequired,
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

    const playingStyles = [
      t('players.styles.attacker'),
      t('players.styles.defender'),
      t('players.styles.allRounder'),
    ];

    const changeStyleModalActions = [
      <FlatButton
        label={t('modal.cancel')}
        secondary={true}
        onTouchTap={::this._closeStyle} />,
      <FlatButton
        label={t('modal.submit')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={::this._saveStyle} />,
    ];
    const selectedPlayer = this.state.editingPlayer;
    const newStyle = this.state.newStyle;

    const playerPaperStyle = {
      height: 80,
      width: 130,
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
                  subtitle={<PlayerPlayingStyle ply={ply} />}>
                  {canChangeStyle ? (
                    <Icon
                      title={t('players.editStyle.tooltip', ply.alias)}
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
                <div className="clickable" onClick={canChangeStyle ? this._openStyle.bind(this, ply) : undefined} style={{display: 'inline-block'}} title={t('players.editStyle.tooltip', ply.alias)}>
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
            title={t('players.editStyle.title', selectedPlayer.alias)}
            actions={changeStyleModalActions}
            bodyStyle={{minHeight: 119}}
            modal={false}
            open={!!this.state.editingPlayer}
            onRequestClose={::this._closeStyle}>

            <AutoComplete
              style={{marginTop: -25}}
              filter={AutoComplete.fuzzyFilter}
              onNewRequest={::this._changeStyle}
              onUpdateInput={::this._changeStyle}
              searchText={newStyle.name || ''}
              floatingLabelText={t('players.editStyle.style')}
              hintText={playingStyles.join(', ')}
              dataSource={playingStyles} />

            <br />

            <TextField
              style={{marginBottom: -25}}
              floatingLabelText={t('players.editStyle.bestStroke')}
              type="text"
              value={newStyle.bestStroke}
              onChange={::this._changeBestStroke} />

            {user.isSystem() ? (
              <PlayerAutoComplete
                selectPlayer={::this._changePlayer}
                floatingLabelText={this.context.t('system.playerSelect')} />
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
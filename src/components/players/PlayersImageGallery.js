import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import withContext, { contextTypes } from '../../utils/decorators/withContext.js';

import * as playerActions from '../../actions/playerActions.js';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Dialog from 'material-ui/lib/dialog';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

import Icon from '../controls/Icon.js';
import Telephone from '../controls/Telephone.js';
import PlayerPlayingStyle from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';

const PlayersImageWidth = 230;
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
  }

  constructor() {
    super();
    this.state = {
      editingStyle: null,
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
    const selectedPlayer = this.state.editingStyle;
    //console.log('selectedPlayer', selectedPlayer);
    const newStyle = this.state.newStyle;
    //console.log('newStyle', newStyle);

    return (
      <div style={gridStyles.root}>
        <GridList
          cellHeight={200}
          cols={Math.min(5, Math.floor(viewport.width / PlayersImageWidth))}
          style={gridStyles.gridList}>
          {players.map(ply => {
            var comp = ply.getCompetition(competition);
            return (
              <GridTile
                key={ply.id}
                title={(
                  <span>
                    <span>{ply.name}</span> <small>{comp ? comp.ranking : '??'}</small>
                  </span>
                )}
                subtitle={<PlayerPlayingStyle ply={ply} />}>
                {user.playerId && user.playerId !== ply.id ? <Icon fa="fa fa-pencil-square-o" style={editStyleIcon} onClick={this._openStyle.bind(this, ply)} /> : null}
                <PlayerImage playerId={ply.id} />
              </GridTile>
            );
          })}
        </GridList>
        {selectedPlayer ? (
          <Dialog
            title={t('players.editStyle.title', selectedPlayer.alias)}
            actions={changeStyleModalActions}
            bodyStyle={{minHeight: 119}}
            modal={false}
            open={!!this.state.editingStyle}
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
          </Dialog>
        ) : null}
      </div>
    );
  }

  _openStyle(ply) {
    this.setState({editingStyle: ply, newStyle: Object.assign({}, ply.style)});
  }
  _closeStyle() {
    this.setState({editingStyle: null, newStyle: {name: '', bestStroke: ''}});
  }
  _saveStyle() {
    this.props.updateStyle(this.state.editingStyle, this.state.newStyle);
    this._closeStyle();
  }

  _changeStyle(text) {
    this.setState({newStyle: Object.assign({}, this.state.newStyle, {name: text})});
  }
  _changeBestStroke(e) {
    this.setState({newStyle: Object.assign({}, this.state.newStyle, {bestStroke: e.target.value})});
  }
}

export default PlayersImageGallery;
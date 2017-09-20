import React, { Component } from 'react';
import PropTypes, { connect, withContext, storeUtil } from '../PropTypes.js';

import * as playerActions from '../../actions/playerActions.js';
import { playerUtils } from '../../models/PlayerModel.js';

import { GridList, GridTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';

import { Icon, Telephone } from '../controls';
import { PlayerPlayingStyle, PlayerPlayingStyleForm } from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';
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
    viewportWidthContainerCount: PropTypes.number.isRequired,
    subtitle: PropTypes.func,
  }
  static defaultProps = {
    viewportWidthContainerCount: 1 // The amount of containers next to eachother that display a PlayersImageGallery
  }

  render() {
    const {players, user, competition, viewport} = this.props;
    const t = this.context.t;

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
              return (
                <GridTile
                  key={ply.id}
                  title={(
                    <span>
                      <span>{ply.name}</span> <small>{comp ? comp.ranking : '??'}</small>
                    </span>
                  )}
                  subtitle={this.props.subtitle ? this.props.subtitle(ply) : <PlayerPlayingStyle ply={ply} allowEdit={false} />}
                >
                  <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={editStyleIcon} />
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
            return (
              <Paper key={ply.id} zDepth={1} style={playerPaperStyle}>
                <PlayerPlayingStyleForm player={ply} iconStyle="avatar" />
                <strong style={{marginLeft: 5}}>{ply.alias}</strong> <small>{comp ? comp.ranking : '??'}</small>

                {user.playerId ? <Telephone player={ply} style={{marginTop: 7}} /> : (
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
      </div>
    );
  }
}

export default PlayersImageGallery;
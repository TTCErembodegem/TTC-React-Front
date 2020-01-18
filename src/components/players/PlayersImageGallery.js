import React, {Component} from 'react';
import PropTypes, {connect, withContext, withViewport} from '../PropTypes.js';
import cn from 'classnames';

import * as playerActions from '../../actions/playerActions.js';
import {playerUtils} from '../../models/PlayerModel.js';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {Telephone, FrenoyLink, PlayerLink} from '../controls.js';
import {PlayerPlayingStyle, PlayerPlayingStyleForm} from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';

const PlayersImageWidth = playerUtils.getPlayerImageSize().width + 30;
const PlayersImageHeight = playerUtils.getPlayerImageSize().height;
const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 6,
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
  right: 15,
  color: '#d3d3d3',
};

class PlayersImageGallery extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.oneOfType([
      PropTypes.PlayerModelList.isRequired,
      PropTypes.array.isRequired,
    ]),
    competition: PropTypes.competition.isRequired,
    viewport: PropTypes.viewport,
    viewportWidthContainerCount: PropTypes.number.isRequired,
    subtitle: PropTypes.func,
    forceSmall: PropTypes.bool,
  }
  static defaultProps = {
    viewportWidthContainerCount: 1, // The amount of containers next to eachother that display a PlayersImageGallery
  }

  render() {
    const {players, competition, viewport} = this.props;

    // This one is used in the MatchCard

    if (viewport.width > 600 && !this.props.forceSmall) {
      // big image gallery
      return (
        <div style={gridStyles.root}>
          <GridList
            cellHeight={PlayersImageHeight}
            cols={Math.min(5, Math.floor((viewport.width / this.props.viewportWidthContainerCount) / PlayersImageWidth))}
            style={gridStyles.gridList}>
            {players.map(ply => {
              const comp = ply.getCompetition(competition);
              return (
                <GridListTile key={ply.id}>
                  <GridListTileBar
                    title={(
                      <span>
                        <PlayerLink player={ply} style={{color: 'white'}} />
                        <small style={{marginLeft: 5}}>{comp ? comp.ranking : '??'}</small>
                      </span>
                    )}
                    subtitle={this.props.subtitle ? this.props.subtitle(ply) : <PlayerPlayingStyle ply={ply} allowEdit={false} />}
                  />
                  <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={editStyleIcon} />
                  <PlayerImage playerId={ply.id} />
                </GridListTile>
              );
            })}
          </GridList>
        </div>
      );
    } else {
      // small card gallery
      return (
        <div style={gridStyles.root}>
          {this.props.players.map(ply => {

            return (
              <div key={ply.id} className={cn({'col-xs-6': viewport.width > 420})} style={{padding: 8}}>
                <div className="media">
                  <div className="media-left">
                    <PlayerPlayingStyleForm player={ply} iconStyle="avatar" />
                  </div>
                  <div className="media-body">
                    <strong>{ply.name}</strong>
                    <br />

                    {this.props.subtitle ? this.props.subtitle(ply) : <SmallPlayerAvatarCard competition={competition} ply={ply} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }
}

const SmallPlayerAvatarCard = ({competition, ply}) => { // eslint-disable-line
  const comp = ply.getCompetition(competition);
  return (
    <span>
      <span className="ellipsis" style={{marginTop: 7, marginRight: 6}}>{ply.style.name}</span>
      {comp ? (
        <FrenoyLink competition={competition} uniqueIndex={comp.uniqueIndex}>
          {comp.ranking + ' '}
        </FrenoyLink>
      ) : null}
      <br />
      <Telephone player={ply} hideIcon />
    </span>
  );
};

export default withContext(withViewport(connect(() => ({}), playerActions)(PlayersImageGallery)));

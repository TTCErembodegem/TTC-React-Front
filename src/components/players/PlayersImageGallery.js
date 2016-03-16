import React, { PropTypes, Component } from 'react';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Telephone from '../controls/Telephone.js';
import PlayerPlayingStyle from './PlayerPlayingStyle.js';
import PlayerImage from './PlayerImage.js';

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

const PlayersImageWidth = 230;
const PlayersImageGallery = ({players, user, competition, viewport}) => (
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
            title={<span><span>{ply.name}</span> <small>{comp ? comp.ranking : '??'}</small></span>}
            subtitle={user.playerId ? <Telephone number={ply.contact.mobile} /> : <PlayerPlayingStyle ply={ply} />}>
            <PlayerImage playerId={ply.id} />
          </GridTile>
        );
      })}
    </GridList>
  </div>
);

export default PlayersImageGallery;
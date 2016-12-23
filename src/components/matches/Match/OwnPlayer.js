import React, { Component } from 'react';
import PropTypes, { storeUtil } from '../../PropTypes.js';
import cn from 'classnames';

import { matchOutcome } from '../../../models/MatchModel.js';
import rankingSorter from '../../../models/utils/rankingSorter.js';
import { PlayerCompetitionBadge } from '../../players/PlayerBadges.js';
import Icon from '../../controls/Icon.js';

const OwnPlayer = ({match, ply, playerAsBadge = false}) => {
  const result = getRankingResults(match, ply);
  if (result.wo) {
    return <div className="irrelevant">{ply.alias}</div>;
  }

  const teamPlayerCount = match.getTeam().getTeamPlayerCount();
  const winNode = renderWinsNode(result, teamPlayerCount);
  const plyInfo = {
    player: storeUtil.getPlayer(ply.playerId),
    matchPlayer: {status: ply.status}
  };

  return (
    <div style={{marginRight: 10}}>
      {playerAsBadge ? (
        <PlayerCompetitionBadge plyInfo={plyInfo} competition={match.competition} style={{marginBottom: 8, marginRight: 8}} />
      ) : (
        <span className="accentuate" style={{marginRight: 7}}>
          <strong>{plyInfo.player.alias}</strong>
        </span>
      )}
      {result.win.size !== teamPlayerCount && result.win.size ? <Icon fa="fa fa-thumbs-o-up" style={{marginRight: 5, color: '#D3D3D3'}} /> : null}
      {winNode}
    </div>
  );
};

function renderWinsNode(result, teamPlayerCount) {
  var winNode = '';
  if (result.win.size > 0) {
    let wins = {};
    for (let i = 0; i < result.win.size; i++) {
      let curWin = result.win.get(i);
      if (!wins[curWin]) {
        wins[curWin] = 1;
      } else {
        wins[curWin]++;
      }
    }

    Object.keys(wins).forEach(key => {
      if (wins[key] === 1) {
        winNode += ', ' + key;
      } else {
        winNode += `, ${wins[key]}x${key}`;
      }
    });
    winNode = result.win.size === teamPlayerCount ? <Icon fa="fa fa-thumbs-up" /> : <small>{winNode.substr(2)}</small>;
  }
  return winNode;
}

function getRankingResults(match, ply) {
  const getAdversaryRanking = game => game.home.uniqueIndex === ply.uniqueIndex ? game.out.ranking : game.home.ranking;

  const plyMatches = match.getGameMatches().filter(game => game.ownPlayer === ply);
  if (plyMatches.every(game => game.outcome === 'WalkOver')) {
    return {
      win: [],
      lost: [],
      wo: true
    };
  }
  const win = plyMatches.filter(game => game.outcome === matchOutcome.Won);
  const lost = plyMatches.filter(game => game.outcome === matchOutcome.Lost);
  return {
    win: win.map(getAdversaryRanking).sort(rankingSorter),
    lost: lost.map(getAdversaryRanking).sort(rankingSorter),
    wo: false
  };
}

export default OwnPlayer;
import React, { Component } from 'react';
import PlayerAvatar from '../../players/PlayerAvatar';
import { IPlayer, ITeam } from '../../../models/model-interfaces';
import { t } from '../../../locales';

type TeamPlayerAvatarsProps = {
  team: ITeam;
  style?: React.CSSProperties;
}

const getSortKey = (player: IPlayer, team: ITeam) => player.getCompetition(team.competition).position;

export class TeamPlayerAvatars extends Component<TeamPlayerAvatarsProps> {
  render() {
    const {team} = this.props;
    const teamPlayers = team.getPlayers('standard')
      .sort((a, b) => getSortKey(a.player, team) - getSortKey(b.player, team));

    return (
      <div style={{textAlign: 'center', ...this.props.style}}>
        {teamPlayers.map(ply => {
          let tooltip = ply.player.name;

          const isCaptain = team.isCaptain(ply.player);
          if (isCaptain) {
            tooltip = `${t('player.teamCaptain')}: ${tooltip}`;
          }

          const comp = ply.player.getCompetition(team.competition);
          if (comp.ranking) {
            tooltip += ` (${comp.ranking})`;
          }

          const avatarStyle = {
            marginLeft: 16,
            marginBottom: 10,
            boxShadow: `3px 3px 3px ${isCaptain ? '#CD7F32' : '#888888'}`,
            display: 'inline-block',
          };

          return (
            <PlayerAvatar
              key={ply.player.id}
              player={ply.player}
              style={avatarStyle}
              tooltip={tooltip}
              tooltipPlacement="bottom"
            />
          );
        })}
      </div>
    );
  }
}

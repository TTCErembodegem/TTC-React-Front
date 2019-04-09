import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import PlayerAvatar from '../../players/PlayerAvatar.js';

export class TeamPlayerAvatars extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    style: PropTypes.object,
  }

  render() {
    const t = this.context.t;
    const {team} = this.props;

    return (
      <div style={{textAlign: 'center', ...this.props.style}}>
        {team.getPlayers('standard').sort((a, b) => a.position - b.position).map(ply => {
          let tooltip = ply.player.name;

          const isCaptain = team.isCaptain(ply.player);
          if (isCaptain) {
            tooltip = t('player.teamCaptain') + ': ' + tooltip;
          }

          const comp = ply.player.getCompetition(team.competition);
          if (comp.ranking) {
            tooltip += ' (' + comp.ranking + ')';
          }

          const avatarStyle = {
            marginLeft: 16,
            marginBottom: 10,
            boxShadow: '3px 3px 3px ' + (isCaptain ? '#CD7F32' : '#888888'),
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

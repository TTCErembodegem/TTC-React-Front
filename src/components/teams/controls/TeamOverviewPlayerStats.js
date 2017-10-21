import React from 'react';
import PropTypes from '../../PropTypes.js';

export const TeamOverviewPlayerStats = ({stat}) => (
  <span>
    {stat.victories} / {stat.games}
    &nbsp;
    ({Math.round(stat.victories / stat.games * 100)}%)
  </span>
);

TeamOverviewPlayerStats.propTypes = {
  stat: PropTypes.shape({
    victories: PropTypes.number.isRequired,
    games: PropTypes.number.isRequired,
  }).isRequired,
};

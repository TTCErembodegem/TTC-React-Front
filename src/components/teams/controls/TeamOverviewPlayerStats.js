import React from 'react';
import PropTypes from '../../PropTypes.js';
import {ThumbsUpIcon, ThumbsDownIcon} from '../../controls.js';

export const TeamOverviewPlayerStats = ({stat}) => (
  <span>
    <ThumbsUpIcon /> {stat.victories}
    <ThumbsDownIcon style={{marginLeft: 8}} /> {stat.games - stat.victories}
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

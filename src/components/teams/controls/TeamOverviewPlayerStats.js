import React from 'react';
import PropTypes from '../../PropTypes.js';
import {ThumbsUpIcon, ThumbsDownIcon, PercentageLabel} from '../../controls.js';

export const TeamOverviewPlayerStats = ({stat}) => (
  <span>
    <ThumbsUpIcon /> {stat.victories}
    <ThumbsDownIcon style={{marginLeft: 8}} /> {stat.games - stat.victories}
    &nbsp;
    <PercentageLabel won={stat.victories} lost={stat.games - stat.victories} />
  </span>
);

TeamOverviewPlayerStats.propTypes = {
  stat: PropTypes.shape({
    victories: PropTypes.number.isRequired,
    games: PropTypes.number.isRequired,
  }).isRequired,
};

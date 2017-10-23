import React from 'react';

export const PercentageLabel = ({won, lost, decimals = 0}) => { // eslint-disable-line
  if (!won && !lost) {
    return null;
  }
  return (
    <div className="pull-right">
      {(won / (lost + won) * 100).toFixed(decimals) + '%'}
    </div>
  );
};

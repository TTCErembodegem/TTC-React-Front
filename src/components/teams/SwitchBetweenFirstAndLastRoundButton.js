import React from 'react';
import moment from 'moment';
import PropTypes from '../PropTypes.js';
import {ButtonStack} from '../controls.js';

export const SwitchBetweenFirstAndLastRoundButton = ({t, setState, matchesFilter}) => (
  <div style={{textAlign: 'center'}}>
    <ButtonStack
      config={[
        {key: 'all', text: t('common.all')},
        {key: 'first', text: t('comp.roundFirst')},
        {key: 'last', text: t('comp.roundBack')},
      ]}
      small={false}
      activeView={matchesFilter}
      onClick={newFilter => {
        setState({matchesFilter: newFilter});
        window.scrollTo(0, 0);
      }}
    />
  </div>
);

SwitchBetweenFirstAndLastRoundButton.propTypes = {
  t: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  matchesFilter: PropTypes.string.isRequired,
};





export function getFirstOrLastMatches(allMatchesToCome, filter) {
  if (filter === 'all') {
    return {
      matches: allMatchesToCome,
      hasMore: false,
    };
  }

  const firstMatches = allMatchesToCome.filter(x => x.date.month() >= 7);
  const lastMatches = allMatchesToCome.filter(x => x.date.month() < 7);
  if (filter === 'first' && firstMatches.length !== 0) {
    return {
      matches: firstMatches,
      hasMore: lastMatches.length !== 0,
    };
  }
  return {
    matches: lastMatches,
    hasMore: firstMatches.length !== 0,
  };
}




export function getFirstOrLast() {
  const today = moment();
  return today.month() >= 7 && !(today.month() === 11 && today.date() > 20) ? 'first' : 'last';
}

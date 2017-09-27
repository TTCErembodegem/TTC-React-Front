import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import {ButtonStack} from '../controls.js';

export const SwitchBetweenFirstAndLastRoundButton = ({t, setState, matchesFilter}) => (
  <div style={{textAlign: 'center'}}>
    <ButtonStack
      config={[
        {key: 'all', text: t('players.all')},
        {key: 'first', text: t('comp.roundFirst')},
        {key: 'last', text: t('comp.roundBack')}
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
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import withContext from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

import { players as playerActionCreators } from '../../../actions/players.js';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, playerActionCreators)
@withContext
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    config: PropTypes.object,
    players: PropTypes.array,
  };

  render() {
    return (
      <div>
        {this.props.config.initialLoadCompleted
          ? this.props.players.map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)
          : 'Oh noes... Loading... :p'}
      </div>
    );
  }
}
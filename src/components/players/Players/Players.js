import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../controls/Spinner';

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
export default class Players extends Component {
  static propTypes = {
    config: PropTypes.object,
    players: PropTypes.array,
  };

  render() {
    if (!this.props.config.initialLoadCompleted) {
      return <Spinner size={5} />;
    }

    return (
      <div>
        {this.props.players.map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)}
      </div>
    );
  }
}
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../../controls/Spinner';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

import { players as playerActionCreators } from '../../../actions/players.js';
// playerActionCreators: no longer called from here (but illustration how actionCreators can be passed as props)

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, playerActionCreators)
@withStyles(styles)
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: PropTypes.array,
  };

  componentDidMount() {
    this.context.setTitle('Spelers overzicht');
  }

  render() {
    if (!this.props.config.initialLoadCompleted) {
      return <Spinner size={5} />;
    }

    return (
      <div>
        {this.props.players.filter(x => x.id < 10).map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)}
      </div>
    );
  }
}
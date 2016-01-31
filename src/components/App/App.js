import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import withContext, { contextTypes } from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
    trans: state.trans
  };
})
//@withContext
@withStyles(styles)
export default class App extends Component {
  static contextTypes = contextTypes;

  static childContextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      setTitle: value => document.title = value || 'TTC Erembodegem',
    };
  }

  static propTypes = {
    children: PropTypes.element,
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
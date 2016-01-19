import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import http from '../../core/HttpClient.js';
import styles from './App.css';
import withContext from '../../decorators/withContext.js';
import withStyles from '../../decorators/withStyles.js';
import Header from '../Header';
import Footer from '../Footer';

import * as playerActionCreators from '../../actions/players.js';

@connect(state => {
  return {
    players: state.players,
    clubs: state.clubs
  };
}, playerActionCreators)
@withContext
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    //children: PropTypes.element.isRequired,
    //error: PropTypes.object,
  };

  componentDidMount() {
    var self = this;
    http.get('/players')
      .then(function(data) {
        self.props.playersLoaded(data);
      }, function(err) {
        console.error(err);
      });

    http.get('/clubs')
      .then(function(data) {
        self.props.clubsLoaded(data);
      }, function(err) {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        {this.props.clubs.map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)}
        <Footer />
      </div>
    );
  }
}
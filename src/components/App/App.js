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
    var promise = http.get('/players');
    promise.then(function(data) {
      self.props.playersLoaded(data);
    }, function(err) {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        {this.props.players.map(ply => <div>{ply.Naam}</div>)}
        <Footer />
      </div>
    );
  }
}
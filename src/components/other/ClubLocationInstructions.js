import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
// import {OwnEmail, GoogleMap} from '../controls.js';

@connect(state => ({params: state.config.get('params')}))
export default class ClubLocationInstructions extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    params: PropTypes.any.isRequired,
  };

  constructor() {
    super();
    this.state = {isOpen: false};
  }

  render() {
    const {params} = this.props;

    const GlobalInfo = (
      <span>
        <b>{params.location}</b>
        <br />
        Makkelijkst via de <b>Assendries</b> de parking oprijden.
      </span>
    );

    if (!this.state.isOpen) {
      return (
        <div>
          {GlobalInfo}
          <button
            className="btn btn-lg btn-success"
            style={{width: '100%'}}
            onClick={() => this.setState({isOpen: !this.state.isOpen})}
          >
            {this.context.t('clubs.location.title')}
          </button>
        </div>
      );
    }

    return (
      <div style={{marginTop: 10, marginBottom: 10}}>
        <h2>{this.context.t('clubs.location.title')}</h2>
        {GlobalInfo}
        <img src="/img/lokaal-instructies/1-poort.jpg" className="img-responsive img-rounded" />
        <br />
        <img src="/img/lokaal-instructies/2-vanop-de-parking.jpg" className="img-responsive img-rounded" />
        <br />
        <img src="/img/lokaal-instructies/3-voorbij-de-container.jpg" className="img-responsive img-rounded" />
        <br />
        <img src="/img/lokaal-instructies/4-enter-our-mansion.jpg" title="Waar het licht brandt :)" className="img-responsive img-rounded" />
      </div>
    );
  }
}

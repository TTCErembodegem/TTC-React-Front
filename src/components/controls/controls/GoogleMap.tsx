import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes';

export class GoogleMapComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    googleMapsUrl: PropTypes.string.isRequired,
  };

  render() {
    return (
      <iframe
        src={this.props.googleMapsUrl}
        frameBorder={0}
        style={{border: 0, width: '100%', height: 450}}
        allowFullScreen
      />
    );
  }
}

export const GoogleMap = connect(state => ({googleMapsUrl: state.config.get('params').googleMapsUrl}))(GoogleMapComponent);

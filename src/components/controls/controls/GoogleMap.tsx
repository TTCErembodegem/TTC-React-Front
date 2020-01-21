import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes';

type GoogleMapComponentProps = {
  googleMapsUrl: string;
}

export class GoogleMapComponent extends Component<GoogleMapComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    return (
      <iframe
        title="Google Maps Clublokaal"
        src={this.props.googleMapsUrl}
        frameBorder={0}
        style={{border: 0, width: '100%', height: 450}}
        allowFullScreen
      />
    );
  }
}

export const GoogleMap = connect(state => ({googleMapsUrl: state.config.get('params').googleMapsUrl}))(GoogleMapComponent);

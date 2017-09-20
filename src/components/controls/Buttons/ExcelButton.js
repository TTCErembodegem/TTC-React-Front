import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import {Icon} from '../Icon.js';

@connect(state => ({user: state.user}))
export class ExcelButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.any,
  }

  constructor() {
    super();
    this.state = {isDownloading: false};
  }

  _onDownload() {
    if (this.state.isDownloading) {
      return;
    }
    this.setState({isDownloading: true});

    this.props.onClick()
      .catch(err => {
        console.error('err', err);
      })
      .then(() => this.setState({isDownloading: false}));
  }

  render() {
    if (!this.props.user.playerId) {
      return <div />;
    }
    return (
      <button onClick={::this._onDownload} className={cn('btn btn-default', this.props.className)} style={this.props.style}>
        <Icon
          fa={cn('fa-2x', this.state.isDownloading ? 'fa fa-spinner fa-pulse' : 'fa fa-file-excel-o')}
          tooltip={this.props.tooltip}
        />
      </button>
    );
  }
}

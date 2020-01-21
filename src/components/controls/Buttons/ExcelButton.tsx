import React, {Component} from 'react';
import cn from 'classnames';
import PropTypes, {connect} from '../../PropTypes';
import {Icon} from '../Icons/Icon';
import {ButtonComponentProps} from './Button';
import {IUser} from '../../../models/UserModel';

type ExcelButtonComponentProps = ButtonComponentProps & {
  user: IUser;
}

type ExcelButtonComponentState = {
  isDownloading: boolean;
}

class ExcelButtonComponent extends Component<ExcelButtonComponentProps, ExcelButtonComponentState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {isDownloading: false};
  }

  _onDownload() {
    if (this.state.isDownloading) {
      return;
    }
    this.setState({isDownloading: true});

    this.props.onClick()
      .catch(err => {
        console.error('err', err); // eslint-disable-line
      })
      .then(() => this.setState({isDownloading: false}));
  }

  render() {
    if (!this.props.user.playerId) {
      return <div />;
    }
    return (
      <button type="button" onClick={() => this._onDownload()} className={cn('btn btn-default', this.props.className)} style={this.props.style}>
        <Icon
          fa={cn('fa-2x', this.state.isDownloading ? 'fa fa-spinner fa-pulse' : 'fa fa-file-excel-o')}
          tooltip={this.props.tooltip}
        />
      </button>
    );
  }
}

export const ExcelButton = connect(state => ({user: state.user}))(ExcelButtonComponent);

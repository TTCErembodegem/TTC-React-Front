import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import { Icon } from './Icon.js';

export const CommentButton = ({onClick, className, style}) => (
  <Button onClick={onClick} className={className} style={style}>
    <Icon fa="fa fa-comment-o" />
  </Button>
);


export const SaveButton = ({onClick, title, style}) => (
  <button className="btn btn-default"onClick={onClick} title={title} style={style}>
    <Icon fa="fa fa-floppy-o" />
  </button>
);


export class FrenoyButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    linkTo: PropTypes.oneOf(['results', 'ranking']).isRequired,
    className: PropTypes.string
  }

  render() {
    const linkTo = this.props.linkTo;
    const isVttl = this.props.team.competition === 'Vttl';
    const style = isVttl ? {bgColor: '#3A5CAA', color: 'white'} : {bgColor: '#9ACA66', color: 'black'};

    return (
      <a href={this.props.team.frenoy.getUrl(linkTo)} target="_blank" className={this.props.className} style={{display: 'inline-block'}}>
        <button className="btn btn-default" style={{backgroundColor: style.bgColor}}>
          <Icon
            fa={cn('fa fa-2x', {'fa-list-ol': linkTo === 'ranking', 'fa-dashboard': linkTo === 'results'})}
            color={style.color}
            tooltip={this.context.t('teamCalendar.frenoy' + linkTo)}
          />
        </button>
      </a>
    );
  }
}


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

import React, { Component } from 'react';
import PropTypes, { connect } from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import { Icon } from '../Icon.js';

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

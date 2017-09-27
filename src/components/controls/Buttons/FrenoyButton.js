import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import {Icon} from '../Icon.js';

function getFrenoyColors(competition) {
  return competition === 'Vttl' ? {bgColor: '#3A5CAA', color: 'white'} : {bgColor: '#9ACA66', color: 'black'};
}

export class FrenoyButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    linkTo: PropTypes.oneOf(['results', 'ranking']).isRequired,
    className: PropTypes.string
  }

  render() {
    const linkTo = this.props.linkTo;
    const style = getFrenoyColors(this.props.team.competition);

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


export class FrenoyWeekLink extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const match = this.props.match;
    const team = match.getTeam();
    return (
      <a href={team.frenoy.getWeekUrl(match.week)} target="_blank" className="frenoy-week-link">
        {match.frenoyMatchId}
      </a>
    );
  }
}

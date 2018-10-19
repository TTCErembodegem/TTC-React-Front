import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import cn from 'classnames';
import {Icon} from '../Icon.js';
import {createFrenoyLinkByUniqueId} from '../../../models/PlayerModel.js';

export const FrenoyPlayerDetailsIcon = () => <Icon fa="fa fa-search" translate tooltip="teamCalendar.frenoyPlayerResults" />;


export const FrenoyLink = ({competition, uniqueIndex, children}) => {
  const frenoyLink = createFrenoyLinkByUniqueId(competition, uniqueIndex);
  if (!frenoyLink) {
    return null;
  }
  return <a href={frenoyLink} target="_blank" className="link-hover-underline">{children}<FrenoyPlayerDetailsIcon /></a>;
};

FrenoyLink.propTypes = {
  competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  uniqueIndex: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired,
};



export class FrenoyButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    linkTo: PropTypes.oneOf(['results', 'ranking']).isRequired,
    className: PropTypes.string
  }

  render() {
    const linkTo = this.props.linkTo;

    return (
      <a href={this.props.team.frenoy.getUrl(linkTo)} target="_blank" className={this.props.className} style={{display: 'inline-block'}}>
        <button className={'btn btn-' + this.props.team.competition}>
          <Icon
            fa={cn('fa fa-2x', {'fa-list-ol': linkTo === 'ranking', 'fa-dashboard': linkTo === 'results'})}
            tooltip={this.context.t('teamCalendar.frenoy' + linkTo)}
          />
        </button>
      </a>
    );
  }
}



export class FrenoyWeekButton extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    week: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    return (
      <a
        href={this.props.team.frenoy.getWeekUrl(this.props.week)}
        target="_blank"
        className={this.props.className}
        style={Object.assign({display: 'inline-block'}, this.props.style)}
      >
        <button className={'btn btn-' + this.props.team.competition}>
          <Icon
            fa="fa fa-2x fa-calendar"
            tooltip={this.context.t('teamCalendar.frenoyweek')}
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
      <a href={team.frenoy.getWeekUrl(match.week)} target="_blank" className="link-hover-underline">
        {match.frenoyMatchId}
      </a>
    );
  }
}

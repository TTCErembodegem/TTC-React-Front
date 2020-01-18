import React, {Component} from 'react';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import PropTypes from '../../PropTypes';
import {Icon} from './Icon';

export const ThrillerIcon = ({color = undefined}) => (
  <Icon
    fa="fa fa-heartbeat faa-pulse animated"
    style={{marginLeft: 3, marginRight: 7, marginTop: 3, color}}
    translate
    tooltip="match.thrillerMatch"
  />
);

ThrillerIcon.propTypes = {
  color: PropTypes.string,
};



// Badgy because material-ui also defines a Badge
export class Badgy extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
    children: PropTypes.any,
    tooltip: PropTypes.string,
  };

  render() {
    const {t} = this.context;
    const {type, style, children, tooltip} = this.props;

    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id={tooltip}>{t(tooltip)}</Tooltip>}>
        <span className={`label label-as-badge ${type}`} style={style}>
          {children}
        </span>
      </OverlayTrigger>
    );
  }
}




export const ThrillerBadge = ({t, match}) => {
  const team = match.getTeam();
  const thrillerType = team.getThriller(match);
  if (thrillerType) {
    const thrillerStyle = {
      position: 'absolute',
      top: 60,
      left: 15,
      fontSize: 16,
      paddingRight: 13,
    };
    return (
      <span className="label label-as-badge label-danger" style={thrillerStyle}>
        <ThrillerIcon />
        {t(`match.${thrillerType}`)}
      </span>
    );
  }
  return <div />;
};

ThrillerBadge.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.MatchModel.isRequired,
};

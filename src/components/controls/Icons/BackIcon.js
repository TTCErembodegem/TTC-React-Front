import React, {Component} from 'react';
import PropTypes, {withViewport, withRouter} from '../../PropTypes.js';
import {Icon} from './Icon.js';

class BackIconComponent extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
  }

  render() {
    const t = this.context.t;
    const {viewport, staticContext, history, location, match, ...props} = this.props; // eslint-disable-line
    return (
      <Icon
        fa={'fa fa-times-circle ' + (viewport.width > 400 ? 'fa-3x' : 'fa-2x')}
        color="red"
        onClick={() => history.goBack()}
        tooltip={t('common.close')}
        tooltipPlacement="left"
        {...props}
      />
    );
  }
}

export const BackIcon = withRouter(withViewport(BackIconComponent));

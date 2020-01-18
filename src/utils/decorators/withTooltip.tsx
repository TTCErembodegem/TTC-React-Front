import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import t from '../../locales';

export function withTooltip(ComposedComponent) {
  return class WithTooltip extends Component {
    static contextTypes = PropTypes.contextTypes;

    static propTypes = {
      tooltip: PropTypes.string,
      title: PropTypes.string,
      translate: PropTypes.bool,
      tooltipPlacement: PropTypes.string,
    }

    static defaultProps = {
      tooltipPlacement: 'top',
    }

    render() {
      const {tooltip, title, translate, tooltipPlacement, ...props} = this.props;

      let realTooltip = tooltip || title;
      if (!realTooltip) {
        return <ComposedComponent {...props} />;
      }

      const id = realTooltip;
      if (translate) {
        realTooltip = t(realTooltip);
      }

      return (
        <OverlayTrigger placement={tooltipPlacement} overlay={<Tooltip id={id}>{realTooltip}</Tooltip>}>
          <ComposedComponent {...props} />
        </OverlayTrigger>
      );
    }
  };
}

import React, {Component, PropTypes} from 'react';
import t from '../../locales.js';

import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

export function withTooltip(ComposedComponent) {
  return class WithTooltip extends Component {
    static contextTypes = PropTypes.contextTypes;
    static propTypes = {
      tooltip: PropTypes.string,
      title: PropTypes.string,
      translate: PropTypes.bool,
    };

    render() {
      const {tooltip, title, translate, ...props} = this.props;

      var realTooltip = tooltip || title;
      if (!realTooltip) {
        return <ComposedComponent {...props} />;
      }

      const id = realTooltip;
      if (translate) {
        realTooltip = t(realTooltip);
      }

      return (
        <OverlayTrigger placement="top" overlay={<Tooltip id={id}>{realTooltip}</Tooltip>}>
          <ComposedComponent {...props} />
        </OverlayTrigger>
      );
    }
  };
}

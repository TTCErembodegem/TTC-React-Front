/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';

import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import t from '../../locales';

type WithTooltipProps = {
  tooltip?: string;
  title?: string;
  translate?: boolean;
  tooltipPlacement?: string;
}

export function withTooltip(ComposedComponent) {
  return class WithTooltip extends Component<WithTooltipProps> {
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

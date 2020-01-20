import React from 'react';
import PropTypes from '../../PropTypes';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {Icon} from '../../controls/Icons/Icon';

export const OpenMatchForEditButton = ({onClick, match, t}) => (
  <button
    onClick={onClick}
    className="btn btn-default pull-right"
    style={{marginRight: 5}}
    title={t('match.plys.tooltipOpenForm')}
  >
    <span className="fa-stack fa-sm">
      {!match.block ? (
        <EditIcon className="fa-stack-1x" />
      ) : (
        <span>
          <Icon fa="fa fa-anchor fa-stack-1x" />
          <Icon fa="fa fa-ban fa-stack-2x text-danger" />
        </span>
      )}
    </span>
  </button>
);

OpenMatchForEditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  match: PropTypes.MatchModel.isRequired,
  t: PropTypes.func.isRequired,
};

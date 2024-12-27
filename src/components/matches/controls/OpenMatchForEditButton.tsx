import React from 'react';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {Icon} from '../../controls/Icons/Icon';
import {IMatch} from '../../../models/model-interfaces';
import { t } from '../../../locales';

type OpenMatchForEditButtonProps = {
  onClick: () => void;
  match: IMatch;
}

export const OpenMatchForEditButton = ({onClick, match}: OpenMatchForEditButtonProps) => (
  <button
    type="button"
    tabIndex={0}
    onClick={onClick}
    className="btn btn-outline-secondary pull-right"
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

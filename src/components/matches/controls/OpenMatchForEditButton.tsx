import React from 'react';
import {EditIcon} from '../../controls/Icons/EditIcon';
import {Icon} from '../../controls/Icons/Icon';
import {IMatch, Translator} from '../../../models/model-interfaces';

type OpenMatchForEditButtonProps = {
  onClick: Function;
  match: IMatch;
  t: Translator;
}

export const OpenMatchForEditButton = ({onClick, match, t}: OpenMatchForEditButtonProps) => (
  <button
    type="button"
    tabIndex={0}
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

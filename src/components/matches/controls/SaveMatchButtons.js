import React from 'react';
import PropTypes from '../../PropTypes.js';
import {CommentButton, SaveButton, Icon} from '../../controls.js';

export const SaveMatchButtons = ({onSave, onBlock, onCommentsToggle, t}) => (
  <div className="pull-right" style={{whiteSpace: 'nowrap'}}>
    <CommentButton onClick={() => onCommentsToggle()} style={{marginRight: 5}} />
    <button
      className="btn btn-default"
      onClick={onBlock}
      style={{marginRight: 5}}
      title={t('match.plys.tooltipSaveAndBlock')}
    >

      <Icon fa="fa fa-anchor" />
    </button>

    <SaveButton onClick={onSave} title={t('match.plys.tooltipSave')} />
  </div>
);

SaveMatchButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
  onCommentsToggle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

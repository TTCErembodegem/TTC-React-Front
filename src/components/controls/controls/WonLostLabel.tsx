import React from 'react';
import {ThumbsUpIcon, ThumbsDownIcon} from '../Icon';

export const WonLostLabel = ({won, lost}) => ( // eslint-disable-line
  <div>
    <ThumbsUpIcon style={{marginLeft: 10}} />
    {won}

    {lost ? <ThumbsDownIcon style={{marginLeft: 8}} /> : null}
    {lost || ''}
  </div>
);

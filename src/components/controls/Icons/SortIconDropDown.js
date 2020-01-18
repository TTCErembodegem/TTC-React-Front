import React, {Component} from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import PropTypes from '../../PropTypes.js';
import {Icon} from './Icon.js';


const SortIcon = ({direction}) => ( // eslint-disable-line
  <Icon fa={`fa fa-2x fa-sort-alpha-${direction}`} translate tooltip="player.sort.tooltip" />
);


export class SortIconDropDown extends Component {
  static propTypes = {
    config: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })).isRequired,
    activeSort: PropTypes.string,
    activeSortDirection: PropTypes.oneOf(['asc', 'desc']),
    onSortChange: PropTypes.func.isRequired,
    onSortDirectionChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    activeSortDirection: 'asc',
  }

  _onButtonSelect(configKey) {
    if (configKey === this.props.activeSort) {
      this.props.onSortDirectionChange(this.props.activeSortDirection === 'asc' ? 'desc' : 'asc');

    } else {
      this.props.onSortChange(configKey);
    }
  }

  render() {
    const {config} = this.props;
    return (
      <DropdownButton title={<SortIcon direction={this.props.activeSortDirection} />} id="sort-dropdown" noCaret pullRight>
        {config.map(button => (
          <MenuItem
            eventKey={button.key}
            key={button.key}
            onSelect={() => this._onButtonSelect(button.key)}
          >

            <Icon
              fa={`fa fa-sort-${this.props.activeSortDirection}`}
              style={{visibility: this.props.activeSort !== button.key ? 'hidden' : null}}
            />

            <span style={{marginLeft: 12}}>{button.text}</span>
          </MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

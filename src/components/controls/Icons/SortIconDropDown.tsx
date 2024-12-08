import React, {Component} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {Icon} from './Icon';


const SortIcon = ({direction}) => ( // eslint-disable-line
  <Icon fa={`fa fa-2x fa-sort-alpha-${direction}`} translate tooltip="player.sort.tooltip" />
);

type SortIconDropDownProps = {
  config: {
    key: string,
    text: string,
  }[],
  activeSort?: string,
  activeSortDirection?: 'asc' | 'desc',
  onSortChange: Function,
  onSortDirectionChange: Function,
}

export class SortIconDropDown extends Component<SortIconDropDownProps> {
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
          <Dropdown.Item
            eventKey={button.key}
            key={button.key}
            onSelect={() => this._onButtonSelect(button.key)}
          >

            <Icon
              fa={`fa fa-sort-${this.props.activeSortDirection}`}
              style={{visibility: this.props.activeSort !== button.key ? 'hidden' : null}}
            />

            <span style={{marginLeft: 12}}>{button.text}</span>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }
}

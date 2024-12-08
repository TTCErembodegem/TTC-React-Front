import React, {Component} from 'react';
import Select from 'react-select';

type PlayerStyleAutocompleteProps = {
  t: Function;
  style?: CSSProperties;
  onChange: Function;
  value?: string;
}

export default class PlayerStyleAutocomplete extends Component<PlayerStyleAutocompleteProps> {
  _onChange(option) {
    this.props.onChange(option.value);
  }

  render() {
    const playingStyles = [
      this.props.t('player.styles.attacker'),
      this.props.t('player.styles.defender'),
      this.props.t('player.styles.allRounder'),
    ];

    return (
      <Select
        isSearchable
        style={this.props.style}
        onChange={option => this._onChange(option)}
        value={({value: this.props.value, label: this.props.value})}
        placeholder={this.props.t('player.editStyle.style')}
        options={playingStyles.map(style => ({label: style, value: style}))}
      />
    );
  }
}

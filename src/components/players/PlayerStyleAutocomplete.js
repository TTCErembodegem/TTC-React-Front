import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Select from 'react-select';

export default class PlayerStyleAutocomplete extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

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
        onChange={::this._onChange}
        value={({value: this.props.value, label: this.props.value})}
        placeholder={this.props.t('player.editStyle.style')}
        options={playingStyles.map(style => ({label: style, value: style}))}
      />
    );
  }
}

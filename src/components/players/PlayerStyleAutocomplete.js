import PropTypes from 'prop-types';
import React, {Component} from 'react';
// import AutoComplete from '@material-ui/core/AutoComplete';

export default class PlayerStyleAutocomplete extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  _onChange(text) {
    this.props.onChange(text);
  }

  render() {
    const playingStyles = [
      this.props.t('player.styles.attacker'),
      this.props.t('player.styles.defender'),
      this.props.t('player.styles.allRounder'),
    ];

    // return (
    //   <AutoComplete
    //     style={this.props.style}
    //     filter={AutoComplete.fuzzyFilter}
    //     onNewRequest={::this._onChange}
    //     onUpdateInput={::this._onChange}
    //     searchText={this.props.value}
    //     label={this.props.t('player.editStyle.style')}
    //     placeholder={playingStyles.join(', ')}
    //     dataSource={playingStyles} />
    // );

    return <span>autocomplete</span>;
  }
}

import React, {PropTypes, Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';

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

    return (
      <AutoComplete
        style={this.props.style}
        filter={AutoComplete.fuzzyFilter}
        onNewRequest={::this._onChange}
        onUpdateInput={::this._onChange}
        searchText={this.props.value}
        floatingLabelText={this.props.t('player.editStyle.style')}
        hintText={playingStyles.join(', ')}
        dataSource={playingStyles} />
    );
  }
}

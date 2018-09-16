import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';

// import AutoComplete from '@material-ui/core/AutoComplete';
import MenuItem from '@material-ui/core/MenuItem';

@connect(state => ({players: state.players}))
export default class PlayerAutoComplete extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    selectPlayer: PropTypes.func.isRequired,
    clearOnSelect: PropTypes.bool,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']),
  }
  static defaultProps = {
    clearOnSelect: false
  }
  constructor() {
    super();
    this.state = {searchText: ''};
  }

  _onPlayerSelected(text) {
    const isPickedFromList = typeof text === 'object';
    var matchedPlayers;
    if (isPickedFromList) {
      text = text.text;
      matchedPlayers = this.props.players.filter(ply => ply.name === text || ply.alias === text);
    } else {
      matchedPlayers = this.props.players.filter(ply => this._filter(text, ply.name));
    }
    this.setState({searchText: text});

    if (text) {
      if (matchedPlayers.size === 1) {
        this.props.selectPlayer(matchedPlayers.first().id);
        if (this.props.clearOnSelect) {
          this.setState({searchText: ''});
        }

      } else if (text.toLowerCase() === 'system' || text.toLowerCase() === 'systeem') {
        this.props.selectPlayer('system');
      }
    }
  }

  render() {
    const {players, selectPlayer, dispatch, clearOnSelect, competition, ...props} = this.props; // eslint-disable-line
    var filteredPlayers = players;
    if (competition) {
      filteredPlayers = players.filter(x => x[competition.toLowerCase()]);
    }
    const playerMenuItems = filteredPlayers.map(ply => ({
      text: ply.name,
      value: <MenuItem secondaryText={competition ? ply[competition.toLowerCase()].ranking : undefined}>{ply.name}</MenuItem>,
    }));
    const aliases = filteredPlayers.filter(ply => ply.name.indexOf(ply.alias) === -1).map(ply => ({
      text: ply.alias,
      value: <MenuItem secondaryText={competition ? ply[competition.toLowerCase()].ranking : undefined}>{ply.alias}</MenuItem>,
    }));

    return <span>autocomplete</span>;

    // return (
    //   <AutoComplete
    //     filter={::this._filter}
    //     searchText={this.state.searchText}
    //     {...props}
    //     onNewRequest={this._onPlayerSelected.bind(this)}
    //     onUpdateInput={this._onPlayerSelected.bind(this)}
    //     dataSource={playerMenuItems.concat(aliases).sort((a, b) => a.text.localeCompare(b.text)).toArray()} />
    // );
  }

  _filter(searchText, personName) {
    if (!searchText) {
      return false;
    }

    searchText = searchText.trim().toLowerCase();
    const lastName = personName.toLowerCase().substring(0, personName.lastIndexOf(' '));
    const firstName = personName.toLowerCase().substring(personName.lastIndexOf(' ') + 1);
    return `${firstName} ${lastName}`.indexOf(searchText) === 0 || `${lastName} ${firstName}`.indexOf(searchText) === 0;
  }
}

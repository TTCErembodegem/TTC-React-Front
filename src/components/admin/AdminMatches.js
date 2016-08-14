import React, { PropTypes, Component } from 'react';
import withViewport from '../../utils/decorators/withViewport.js';
import Button from 'react-bootstrap/lib/Button';
import TextField from 'material-ui/lib/text-field';
import { browserHistory } from 'react-router';
import { contextTypes } from '../../utils/decorators/withContext.js';


@withViewport
export default class AdminMatches extends Component {
  static contextTypes = contextTypes;
  constructor() {
    super();
    this.state = {
      matchId: PropTypes.object.isRequired
    };
  }

  render() {
    const t = this.context.t;
    return (
      <div>
        <TextField
              hintText="Geef match ID in"
              style={{width: 150, marginLeft: 10}}
              onChange={e => this.setState({ matchId: e.target.value })} />

        <Button style={{marginLeft: 20}} onClick={() => browserHistory.push(t.route('match', {matchId: this.state.matchId}))}>Ga naar match</Button>
     </div>
    );
  }
}
import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import TextField from '@material-ui/core/TextField';
import {MaterialButton} from '../controls/Button.js';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

export default class AdminClubForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    club: PropTypes.ClubModel,
    updateClub: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = props.club;
  }

  render() {
    const club = this.state;
    const fieldMargin = 30;

    return (
      <div style={{marginLeft: 10, marginRight: 10}}>
        <h3>{club.name}</h3>
        <div>
          <Paper style={{padding: 15}}>
            <h4>Gegevens</h4>
            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('Naam')}
              defaultValue={club.name}
              onChange={e => this.setState({name: e.target.value})}
            />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={this.context.t('Website')}
              defaultValue={club.website || ''}
              onChange={e => this.setState({website: e.target.value})}
            />

            <Checkbox
              checked={club.shower}
              onChange={() => this.setState({shower: !this.state.shower})}
              value="hasShower"
            />
            {this.context.t('Shower')}
          </Paper>
        </div>
        <MaterialButton variant="contained"
          label={this.context.t('common.save')}
          primary={true}
          style={{marginTop: 5}}
          onClick={() => {
            this.props.updateClub(this.state);
            this.props.onEnd();
          }}
        />

        <MaterialButton variant="contained"
          label={this.context.t('common.cancel')}
          style={{marginTop: 5, marginLeft: 10}}
          onClick={() => this.props.onEnd()}
        />
      </div>
    );
  }
}

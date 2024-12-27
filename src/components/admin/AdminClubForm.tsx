import React, {Component} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import {IClub} from '../../models/model-interfaces';
import { t } from '../../locales';

type AdminClubFormProps = {
  club: IClub;
  updateClub: Function;
  onEnd: Function;
}

export default class AdminClubForm extends Component<AdminClubFormProps, IClub> {
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
              label={t('Naam')}
              defaultValue={club.name}
              onChange={e => this.setState({name: e.target.value})}
            />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={t('Website')}
              defaultValue={club.website || ''}
              onChange={e => this.setState({website: e.target.value})}
            />

            <Checkbox
              checked={club.shower}
              onChange={() => this.setState(prevState => ({shower: !prevState.shower}))}
              value="hasShower"
            />
            {t('Shower')}
          </Paper>
        </div>
        <MaterialButton
          variant="contained"
          label={t('common.save')}
          color="primary"
          style={{marginTop: 5}}
          onClick={() => {
            this.props.updateClub(this.state);
            this.props.onEnd();
          }}
        />

        <MaterialButton
          variant="contained"
          label={t('common.cancel')}
          style={{marginTop: 5, marginLeft: 10}}
          onClick={() => this.props.onEnd()}
        />
      </div>
    );
  }
}

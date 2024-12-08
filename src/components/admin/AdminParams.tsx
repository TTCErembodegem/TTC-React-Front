import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import PropTypes, {connect} from '../PropTypes';
import * as configActions from '../../actions/configActions';

type AdminParamsComponentProps = {
  propTypes: Function;
  configParams: any;
  saveConfigParam: Function;
}

type AdminParamsComponentState = {
  [key: string]: string;
}


class AdminParamsComponent extends Component<AdminParamsComponentProps, AdminParamsComponentState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {...props.configParams};
  }

  render() {
    const params = this.props.configParams;
    const onSave = this.props.saveConfigParam;
    return (
      <div style={{paddingLeft: 15}}>
        <h3>Beheer Parameters</h3>
        <span>Nieuw Seizoen? Bewaar de &quot;year&quot; parameter!</span>
        <Table condensed hover width="100%">
          <thead>
            <tr>
              <th width={200}>Key</th>
              <th width="99%">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(params).sort((a, b) => a.localeCompare(b)).map(key => (
              <AdminParamRow
                key={key}
                propName={key}
                value={this.state[key]}
                onChange={value => this.setState(prevState => ({...prevState, [key]: value}))}
                onSave={() => onSave(key, this.state[key])}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}


const AdminParamRow = ({propName, value, onChange, onSave}) => { // eslint-disable-line
  return (
    <tr>
      <td>{propName}:</td>
      <td>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{width: '90%', marginRight: 6}} />
        <button type="button" aria-label="Save" className="btn btn-default btn-sm" onClick={onSave}><i className="fa fa-floppy-o" /></button>
      </td>
    </tr>
  );
};

export const AdminParams = connect(state => ({configParams: state.config.get('params')}), configActions)(AdminParamsComponent);

import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import PropTypes, {connect} from '../PropTypes.js';
import * as configActions from '../../actions/configActions.js';



class AdminParamsComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    saveConfigParam: PropTypes.func.isRequired,
    configParams: PropTypes.object.isRequired,
  }

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
        <span>Nieuw Seizoen? Bewaar de "year" parameter!</span>
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
                onChange={value => this.setState({...this.state, [key]: value})}
                onSave={onSave.bind(this, key, this.state[key])}
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
        <button className="btn btn-default btn-sm" onClick={onSave}><i className="fa fa-floppy-o" /></button>
      </td>
    </tr>
  );
};

export const AdminParams = connect(state => ({configParams: state.config.get('params')}), configActions)(AdminParamsComponent);

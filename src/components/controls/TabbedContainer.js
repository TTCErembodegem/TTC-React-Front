import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../utils/decorators/withContext.js';
import withViewport from '../../utils/decorators/withViewport.js';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

@withViewport
export default class TabbedContainer extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    openTabKey: PropTypes.number,
    tabKeys: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      label: PropTypes.string,
      show: PropTypes.bool,
      headerChildren: PropTypes.node,
    }).isRequired),
    tabRenderer: PropTypes.func.isRequired,
    onTabSelect: PropTypes.func,
    forceTabs: PropTypes.bool,

    viewport: PropTypes.object.isRequired,
  }
  static defaultProps = {
    forceTabs: false
  }

  constructor(props) {
    super(props);
    this.state = {
      openTabKey: props.openTabKey
    };
  }

  _showAccordion() {
    // Otherwise show tabs
    return this.props.viewport.width < 700 && !this.props.forceTabs;
  }

  render() {
    if (this._showAccordion()) {
      return (
        <PanelGroup activeKey={this.state.openTabKey} onSelect={::this._onTabSelect} accordion>
          {this.props.tabKeys.filter(tab => tab.show !== false).map(tab => this._renderNavItem(tab))}
        </PanelGroup>
      );
    }

    return (
      <div>
        <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
          {this.props.tabKeys.filter(tab => tab.show !== false).map(tab => this._renderNavItem(tab))}
        </Nav>
        <div className="match-card-tab">
          {this.props.tabRenderer(this.state.openTabKey)}
        </div>
      </div>
    );
  }

  _renderNavItem(tab) {
    if (!this._showAccordion()) {
      // Tabs
      return (
        <NavItem eventKey={tab.key} title={tab.label ? tab.title : undefined} key={tab.key}>
          {tab.label || tab.title} {tab.headerChildren}
        </NavItem>
      );
    }

    // Accordion
    const header = <div>{tab.title} {tab.headerChildren}</div>;
    return (
      <Panel header={header} eventKey={tab.key} className="match-card-panel clickable" onClick={this._onTabSelect.bind(this, tab.key)} key={tab.key}>
        {this.props.tabRenderer(tab.key)}
      </Panel>
    );
  }
  _onTabSelect(eventKey) {
    this.setState({openTabKey: eventKey});
    if (this.props.onTabSelect) {
      this.props.onTabSelect(eventKey);
    }
  }
}
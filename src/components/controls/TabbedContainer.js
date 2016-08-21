import React, { Component } from 'react';
import PropTypes, { withViewport, browserHistory } from '../PropTypes.js';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

@withViewport
export default class TabbedContainer extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    defaultTabKey: PropTypes.string.isRequired,
    params: PropTypes.shape({
      tabKey: PropTypes.string
    }),
    tabKeys: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      label: PropTypes.string,
      show: PropTypes.bool,
      headerChildren: PropTypes.node,
    }).isRequired),
    tabRenderer: PropTypes.func.isRequired,
    onTabSelect: PropTypes.func,
    forceTabs: PropTypes.bool,
    widthTreshold: PropTypes.number,
    style: PropTypes.object,
    route: PropTypes.shape({
      base: PropTypes.string.isRequired,
      subs: PropTypes.string
    }),

    viewport: PropTypes.viewport,
  }
  static defaultProps = {
    forceTabs: false,
    widthTreshold: 700
  }

  constructor(props) {
    super(props);
    this.state = {openTabKey: props.defaultTabKey, forceClose: false};
  }

  _showAccordion() {
    // Otherwise show tabs
    return this.props.viewport.width < this.props.widthTreshold && !this.props.forceTabs;
  }

  render() {
    const openTabKey = this._getTabKey();
    if (this._showAccordion()) {
      // Accordion
      return (
        <PanelGroup activeKey={!this.state.forceClose ? openTabKey : null} style={this.props.style}>
          {this.props.tabKeys.filter(tab => tab.show !== false).map(tab => this._renderTabHeader(tab))}
        </PanelGroup>
      );
    }

    // Tabs
    return (
      <div style={this.props.style}>
        <Nav bsStyle="tabs" activeKey={openTabKey} onSelect={::this._onTabSelect}>
          {this.props.tabKeys.filter(tab => tab.show !== false).map(tab => this._renderTabHeader(tab))}
        </Nav>
        <div className="match-card-tab">
          {this.props.tabRenderer(openTabKey)}
        </div>
      </div>
    );
  }
  _renderTabHeader(tab) {
    if (!this._showAccordion()) {
      // Tabs
      return (
        <NavItem eventKey={tab.key} title={tab.label ? tab.title : undefined} key={tab.key}>
          {tab.label || tab.title} {tab.headerChildren}
        </NavItem>
      );
    }

    // Accordion
    const header = (
      <div className="clickable" onClick={this._onTabSelect.bind(this, tab.key)}>
        {tab.title} {tab.headerChildren}
      </div>
    );
    return (
      <Panel collapsible expanded={this.state.openTabKey === tab.key && !this.state.forceClose}
        header={header}
        eventKey={tab.key}
        className="match-card-panel"
        key={tab.key}
      >
        {this.props.tabRenderer(tab.key)}
      </Panel>
    );
  }

  _onTabSelect(eventKey) {
    if (this.props.route) {
      if (this.props.route.subs) {
        browserHistory.push(this.props.route.base + '/' + this.context.t.route(this.props.route.subs + '.' + eventKey));
      } else {
        browserHistory.push(this.props.route.base + '/' + eventKey);
      }
    }
    const forceClose = this._showAccordion() && eventKey === this.state.openTabKey && !this.state.forceClose;
    this.setState({openTabKey: eventKey, forceClose});

    if (this.props.onTabSelect) {
      this.props.onTabSelect(eventKey);
    }
  }
  _getTabKey() {
    if (!this.props.route) {
      return this.state.openTabKey;
    }

    // Translate from route
    const tabKey = this.props.params ? this.props.params.tabKey : null;
    if (!tabKey) {
      return this.props.defaultTabKey;
    }
    if (!this.props.route.subs) {
      return tabKey;
    }
    return this.context.t.reverseRoute(this.props.route.subs, tabKey);
  }
}
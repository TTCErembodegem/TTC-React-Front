import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes, {withViewport} from '../PropTypes.js';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

@withRouter
@withViewport
export class TabbedContainer extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    defaultTabKey: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tabKey: PropTypes.string
      }),
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
      subs: PropTypes.string,
      suffix: PropTypes.string,
    }).isRequired,

    viewport: PropTypes.viewport,
    history: PropTypes.any.isRequired,
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
        <PanelGroup defaultActiveKey={!this.state.forceClose ? openTabKey : null} style={this.props.style} id={openTabKey}>
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
        <NavItem
          eventKey={tab.key}
          title={tab.label ? tab.title : undefined}
          key={tab.key}
          href={this._getUrl(tab.key)} onClick={e => e.preventDefault()}
        >
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

    const isOpen = this.state.openTabKey === tab.key && !this.state.forceClose;
    return (
      <Panel
        defaultExpanded={isOpen}
        eventKey={tab.key}
        className="match-card-panel"
        key={tab.key}
      >
        <Panel.Heading>
          {header}
        </Panel.Heading>
        {isOpen ? this.props.tabRenderer(tab.key) : null}
      </Panel>
    );
  }

  _getUrl(eventKey) {
    var url;
    if (this.props.route.subs) {
      url = this.props.route.base + '/' + this.context.t.route(this.props.route.subs + '.' + eventKey);
    } else {
      url = this.props.route.base + '/' + eventKey;
    }
    if (this.props.route.suffix) {
      url += '/' + this.props.route.suffix;
    }
    return url;
  }

  _onTabSelect(eventKey) {
    var url = this._getUrl(eventKey);
    this.props.history.push(url);

    const forceClose = this._showAccordion() && eventKey === this.state.openTabKey && !this.state.forceClose;
    this.setState({openTabKey: eventKey, forceClose});

    if (this.props.onTabSelect) {
      this.props.onTabSelect(eventKey);
    }
  }
  _getTabKey() {
    // Translate from route
    const tabKey = this.props.match ? this.props.match.params.tabKey : null;
    if (!tabKey) {
      return this.props.defaultTabKey;
    }
    if (!this.props.route.subs) {
      return tabKey;
    }
    return this.context.t.reverseRoute(this.props.route.subs, tabKey);
  }
}

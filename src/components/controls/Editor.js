// TODO: disableEditing doesn't work: https://github.com/wangzuo/react-medium-editor/issues/15

var assign = require('object-assign');
var blacklist = require('blacklist');
const PropTypes = require('prop-types');
var React = require('react');
var ReactDOM = require('react-dom');

if (typeof document !== 'undefined') {
  var MediumEditor = require('medium-editor');
}

export class Editor extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    options: PropTypes.object,
    tag: PropTypes.string,
    onChange: PropTypes.func,
    contentEditable: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {text: this.props.text};
  }

  static defaultProps = {tag: 'div'}

  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    this.medium = new MediumEditor(dom, this.props.options);
    this.medium.subscribe('editableInput', () => {
      this._updated = true;
      this.change(dom.innerHTML);
    });
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text && !this._updated) {
      this.setState({text: nextProps.text});
    }

    if (this._updated) {
      this._updated = false;
    }
  }

  render() {
    var tag = this.props.tag;
    var props = blacklist(this.props, 'tag', 'dangerouslySetInnerHTML', 'text', 'options');

    props = assign({}, props, {
      contentEditable: this.props.contentEditable, // TODO: real fix = !this.props.options.disableEditing?
      dangerouslySetInnerHTML: {__html: this.state.text}
    });

    return React.createElement(tag, props);
  }

  change(text) {
    if (this.props.onChange) {
      this.props.onChange(text, this.medium);
    }
  }
}

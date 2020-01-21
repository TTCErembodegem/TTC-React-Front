// TODO: disableEditing doesn't work: https://github.com/wangzuo/react-medium-editor/issues/15
const blacklist = require('blacklist');
const React = require('react');
const ReactDOM = require('react-dom');

if (typeof document !== 'undefined') {
  // eslint-disable-next-line vars-on-top, no-var, global-require
  var MediumEditor = require('medium-editor');
}

type EditorProps = {
  text: string,
  options: any,
  tag: string,
  onChange: Function,
  contentEditable: boolean,
}

type EditorState = {
  text: string;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props) {
    super(props);
    this.state = {text: this.props.text};
  }

  static defaultProps = {tag: 'div'}

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = ReactDOM.findDOMNode(this);
    // eslint-disable-next-line block-scoped-var
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
    const {tag} = this.props;
    let props = blacklist(this.props, 'tag', 'dangerouslySetInnerHTML', 'text', 'options');

    props = {
      ...props,
      contentEditable: this.props.contentEditable, // TODO: real fix = !this.props.options.disableEditing?
      dangerouslySetInnerHTML: {__html: this.state.text},
    };

    return React.createElement(tag, props);
  }

  change(text: string) {
    if (this.props.onChange) {
      this.props.onChange(text, this.medium);
    }
  }
}

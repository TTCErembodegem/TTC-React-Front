import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { util as storeUtils } from '../../../store.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';
import * as matchActions from '../../../actions/matchActions.js';
import UserModel from '../../../models/UserModel.js';

import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';
import Editor from 'react-medium-editor';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

@connect(state => {
  return {};
}, matchActions)
export default class MatchReport extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.instanceOf(UserModel).isRequired,
    match: PropTypes.instanceOf(MatchModel).isRequired,
    t: PropTypes.func.isRequired,
    postReport: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      text: props.match.description,
      comment: '',
      commentFormOpen: false,
    };
  }

  render() {
    const editorHeight = 200;
    const editorOptions = {
      buttonLabels: 'fontawesome',
      placeholder: {
        text: this.context.t('match.report.placeHolder')
      },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'anchor']
      }
    };

    var reportWriterText;
    var reportWriter = storeUtils.getPlayer(this.props.match.reportPlayerId);
    if (reportWriter) {
      reportWriterText = (
        <div style={{marginTop: -10, color: '#736F6E'}}>
          <small>{this.context.t('match.report.reportWrittenBy', reportWriter.alias)}</small>
        </div>
      );
    }

    // TODO: disableEditing doesn't work: https://github.com/wangzuo/react-medium-editor/issues/15

    var canPostReport = this.props.user.canPostReport(this.props.match.teamId);
    var reportText = (
      <div>
        {reportWriterText}
        <Editor
          tag="pre"
          text={this.state.text}
          style={{height: canPostReport ? editorHeight : undefined}}
          onChange={::this._reportTextChange}
          options={editorOptions}
          disableEditing={!canPostReport} />

        {canPostReport ? (
          <RaisedButton
            label={this.context.t('match.report.postReport')}
            primary={true}
            style={{float: 'right', marginBottom: 65}}
            onClick={::this._onPostReport} />
        ) : null}
      </div>
    );

    if (!canPostReport && !this.state.text) {
      reportText = this.context.t('match.report.noReport');
    }

    var comments;
    var showComments = this.props.user.playerId || this.props.match.comments.size;
    if (showComments) {
      comments = (
        <div>
          <h3 style={{marginTop: canPostReport ? 55 : 0}}>{this.context.t('match.report.commentsTitle')}</h3>
          {this.props.match.comments.map(::this._renderComment)}
          {this.state.commentFormOpen ? (
            <Editor
              tag="pre"
              text={this.state.comment}
              style={{height: 55}}
              onChange={::this._reportCommentChange}
              options={editorOptions} />
          ) : null}

          {this.props.user.playerId ? (
            <FlatButton
              label={this.context.t('match.report.commentsOpenForm')}
              onClick={::this._onCommentForm} />
          ) : null}
        </div>
      );
    }

    return (
      <div style={{marginLeft: 20, marginTop: 20, marginRight: 20}}>
        <h3>{this.context.t('match.report.title')}</h3>
        {reportText}
        {comments}
      </div>
    );
  }

  _renderComment(comment) {
    var poster = storeUtils.getPlayer(comment.playerId);
    return (
      <div>
        <Editor text={poster.alias + ':' + comment.text} disableEditing={true} />
      </div>
    );
  }

  _reportTextChange(text, medium) {
    this.setState({text});
  }
  _onPostReport() {
    this.props.postReport(this.props.match.id, this.state.text);
  }

  _onCommentForm() {
    if (this.state.commentFormOpen) {
      if (this.state.comment) {
        this.props.postComment(this.props.match.id, this.state.comment);
        this.setState({commentFormOpen: false, comment: ''});
      }
    } else {
      this.setState({commentFormOpen: true});
    }
  }
  _reportCommentChange(text, medium) {
    this.setState({comment: text});
  }
}
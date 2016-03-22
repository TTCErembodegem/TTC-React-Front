import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { util as storeUtils } from '../../../store.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';
import * as matchActions from '../../../actions/matchActions.js';
import UserModel from '../../../models/UserModel.js';

import TimeAgo from '../../controls/TimeAgo.js';
import Icon from '../../controls/Icon.js';
import Editor from '../../controls/Editor.js';
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
      reportFormOpen: false,
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
    const reportWriter = storeUtils.getPlayer(this.props.match.reportPlayerId);
    if (reportWriter) {
      reportWriterText = (
        <div style={{marginTop: -10, color: '#736F6E'}}>
          <small>{this.context.t('match.report.reportWrittenBy', reportWriter.alias)}</small>
        </div>
      );
    }

    const readonlyReport = this.state.text ? <pre dangerouslySetInnerHTML={{__html: this.state.text}} /> : null;

    var reportText;
    const canComment = this.props.user.playerId;
    const showComments = canComment || this.props.match.comments.size;
    const canPostReport = this.props.user.canPostReport(this.props.match.teamId) && this.props.match.isScoreComplete();
    if (this.props.match.isScoreComplete()) {
      reportText = (
        <div>
          {reportWriterText}
          {canPostReport ? (
            <div>
              {this.state.reportFormOpen ? (
                <div>
                  <Editor
                    tag="pre"
                    text={this.state.text}
                    style={{height: canPostReport ? editorHeight : undefined}}
                    onChange={::this._reportTextChange}
                    options={{...editorOptions, disableEditing: !canPostReport}}
                    contentEditable={canPostReport} />

                  <RaisedButton
                    label={this.context.t('match.report.postReport')}
                    primary={true}
                    style={{float: 'right', marginBottom: 65}}
                    onClick={::this._onPostReport} />
                </div>
              ) : readonlyReport}
            </div>
          ) : readonlyReport}
        </div>
      );
    }

    if (!canPostReport && !this.state.text && !showComments) {
      reportText = this.context.t('match.report.noReport');
    }

    var comments;
    if (showComments) {
      comments = (
        <div>
          {this.state.text || this.state.reportFormOpen ? <h3 style={{marginTop: this.state.reportFormOpen ? 55 : 0}}>{this.context.t('match.report.commentsTitle')}</h3> : null}
          {this.props.match.comments.map(::this._renderComment)}
          {this.state.commentFormOpen ? (
            <Editor
              tag="pre"
              text={this.state.comment}
              style={{height: 55, width: '100%'}}
              onChange={::this._reportCommentChange}
              options={{...editorOptions, disableEditing: !canComment}}
              contentEditable={canComment} />
          ) : null}

          {this.props.user.playerId ? (
            <FlatButton
              label={this.context.t('match.report.commentsOpenForm')}
              onClick={::this._onCommentForm}
              style={{paddingLeft: 0}} />
          ) : null}
        </div>
      );
    }

    return (
      <div>
        <h3>
          {this.context.t('match.report.title')}
          {canPostReport ? (
            <small><Icon
              fa="fa fa-pencil-square-o"
              title={this.context.t('match.report.editTooltip')}
              onClick={::this._onReportFormOpen}
              style={{marginLeft: 5, color: '#D3D3D3'}}/></small>
          ) : null}
        </h3>
        {reportText}
        {comments}
      </div>
    );
  }

  _renderComment(comment) {
    const poster = storeUtils.getPlayer(comment.playerId);
    return (
      <div key={comment.id}>
        <strong style={{marginRight: 6}}>{poster.alias}</strong>
        <TimeAgo date={comment.postedOn} />

        <div dangerouslySetInnerHTML={{__html: comment.text}} />
      </div>
    );
  }

  _reportTextChange(text, medium) {
    this.setState({text});
  }
  _onPostReport() {
    this.props.postReport(this.props.match.id, this.state.text);
  }
  _onReportFormOpen() {
    this.setState({reportFormOpen: !this.state.reportFormOpen});
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
import React, { Component } from 'react';
import PropTypes, { connect } from '../../PropTypes.js';
import { util as storeUtils } from '../../../store.js';
import * as matchActions from '../../../actions/matchActions.js';

import TimeAgo from '../../controls/TimeAgo.js';
import Icon from '../../controls/Icon.js';
import Editor from '../../controls/Editor.js';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Checkbox from 'material-ui/lib/checkbox';
import PlayerAutoComplete from '../../players/PlayerAutoComplete.js';
import ImageDropzone from '../../controls/images/ImageDropzone.js';

function getEmptyComment(matchId, playerId) {
  return {
    matchId: matchId,
    playerId: playerId,
    text: '',
    hidden: false,
  };
}

@connect(() => ({}), matchActions)
export default class MatchReport extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired,
    match: PropTypes.MatchModel.isRequired,
    t: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,
    postReport: PropTypes.func.isRequired,
    postComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      text: props.match.description,
      commentImageFormOpen: false,
      commentFormOpen: false,
      comment: getEmptyComment(this.props.match.id, props.user.playerId),
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
                    label={this.context.t('common.save')}
                    primary={true}
                    style={{float: 'right', marginBottom: 65}}
                    onClick={::this._onPostReport} />
                </div>
              ) : readonlyReport}
            </div>
          ) : readonlyReport}
        </div>
      );
    } else if (this.state.text) {
      reportText = readonlyReport;
    }

    if (!canPostReport && !this.state.text && !showComments) {
      reportText = this.context.t('match.report.noReport');
    }

    const width = this.props.viewport.width;
    const canDeleteComment = this.props.user.isAdmin();

    var comments;
    if (showComments) {
      comments = (
        <div>
          {this.state.text || this.state.reportFormOpen ? (
            <h3 style={{marginTop: this.state.reportFormOpen ? 55 : 0}}>
              {this.context.t('match.report.commentsTitle')}
            </h3>
          ) : null}
          {this.props.match.comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              deleteComment={canDeleteComment || comment.playerId === this.props.user.playerId ? this.props.deleteComment : null} />)
          )}
          {this.state.commentFormOpen ? (
            <div>
              {this.props.user.isSystem() ? (
                <PlayerAutoComplete
                  selectPlayer={::this._reportCommentPlayerChange}
                  hintText={this.context.t('system.playerSelect')} />
              ) : null}
              <Editor
                tag="pre"
                text={this.state.comment.text}
                style={{height: 55, width: '99%'}}
                onChange={::this._reportCommentChange}
                options={{...editorOptions, disableEditing: !canComment}}
                contentEditable={canComment} />
            </div>
          ) : this.state.commentImageFormOpen ? (
            <ImageDropzone t={this.context.t} fileUploaded={::this._onCommentImageUploaded} type="match" />
          ) : null}

          {this.props.user.playerId ? (
            <div style={{width: '100%'}}>
              {this.state.commentFormOpen ? (<Checkbox
                defaultChecked={!this.state.comment.hidden}
                onCheck={::this._reportHiddenChange}
                style={width > 450 ? {float: 'right', width: 220, textAlign: 'right'} : {}}
                label={this.context.t('match.report.commentVisible')} />
              ) : null}

              <FlatButton
                label={this.context.t('match.report.commentsOpenForm')}
                onClick={::this._onCommentForm}
                style={{paddingLeft: 0}} />

              <FlatButton
                onClick={() => this.setState({commentImageFormOpen: !this.state.commentImageFormOpen, commentFormOpen: false})}
                style={{marginLeft: 15}}>

                <Icon fa="fa fa-picture-o" />
              </FlatButton>

            </div>
          ) : null}
        </div>
      );
    }

    // TODO: replace #D3D3D3 with #999? (iPhone visibility)
    return (
      <div className="match-card-tab-content">
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

  _onCommentImageUploaded(fileName) {
    this.setState({commentImageFormOpen: false});
    this.props.postComment(Object.assign({}, getEmptyComment(this.props.match.id, this.props.user.playerId), {imageUrl: fileName}));
  }

  _reportTextChange(text) {
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
      if (this.state.comment.text) {
        this.props.postComment(this.state.comment);
        this.setState({comment: getEmptyComment(this.props.match.id, this.props.user.playerId), commentFormOpen: false});
      }
    } else {
      this.setState({commentFormOpen: true});
    }
  }
  _reportCommentChange(text/*, medium*/) {
    this.setState({comment: Object.assign({}, this.state.comment, {text})});
  }
  _reportHiddenChange() {
    this.setState({comment: Object.assign({}, this.state.comment, {hidden: !this.state.comment.hidden})});
  }
  _reportCommentPlayerChange(playerId) {
    this.setState({comment: Object.assign({}, this.state.comment, {playerId})});
  }
}


class Comment extends Component {
  static propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired,
      playerId: PropTypes.number.isRequired,
      hidden: PropTypes.bool.isRequired,
      postedOn: PropTypes.object.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
    deleteComment: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      hover: false,
    };
  }
  render() {
    const comment = this.props.comment;
    const poster = storeUtils.getPlayer(comment.playerId) || {alias: 'SYSTEM'};
    const canDeleteComment = !!this.props.deleteComment;

    return (
      <div
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        style={Object.assign({padding: 6, marginRight: 10}, this.state.hover ? {backgroundColor: '#EEE9E9'} : {})}>

        {this.state.hover && canDeleteComment ? (
          <Icon fa="fa fa-trash-o fa-lg" style={{float: 'right', marginTop: 6}} onClick={this.props.deleteComment.bind(this, comment.id)} />
        ) : null}
        {comment.hidden ? <Icon fa="fa fa-user-secret" /> : null}
        <strong style={{marginRight: 6}}>{poster.alias}</strong>
        <TimeAgo date={comment.postedOn} style={{color: '#999'}} />

        {comment.imageUrl ? <div><img src={comment.imageUrl} style={{maxWidth: '95%'}} /></div>
        : <div dangerouslySetInnerHTML={{__html: comment.text}} />}
      </div>
    );
  }
}
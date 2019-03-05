import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import classes from './comments.module.scss'

import API from '../../services/services'

class Comments extends Component {
  state = {
    isFetchingComments: true,
    comments: [],

    // For Add or Edit Comment
    selectedComment: {},
    useForEdit: false,
    openDialog: false,
    isSaving: false,
    commentName: '',
    commentContent: ''
  }

  getComments = async () => {
    try {
      await this.setState({
        isFetchingComments: true
      })

      const response = await API.get('/comments', {
        params: {
          postId: this.props.match.params.postId
        }
      })
      await this.setState({
        comments: response.data
      })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({
        isFetchingComments: false
      })
    }
  }

  onDeleteComment = async comment => {
    try {
      await API.delete(`/comments/${comment.id}`)

      const comments = [...this.state.comments]
      const index = comments.findIndex(
        commentObj => commentObj.id === comment.id
      )
      comments.splice(index, 1)

      await this.setState({ comments })
    } catch (error) {
      console.log(error)
    }
  }

  onEditClick = async comment => {
    await this.setState({
      useForEdit: true,
      openDialog: true,
      commentName: comment.name,
      commentContent: comment.body,
      selectedComment: comment
    })
  }

  onAddClick = async () => {
    await this.setState({
      useForEdit: false,
      openDialog: true
    })
  }

  onDialogClose = async () => {
    await this.setState({
      openDialog: false,
      commentName: '',
      commentContent: ''
    })
  }

  onDialogSave = async () => {
    try {
      await this.setState({ isSaving: true })

      let response, comments

      // If used for Edit Comment
      if (this.state.useForEdit) {
        response = await API.put(`/comments/${this.state.selectedComment.id}`, {
          data: {
            name: this.state.commentName,
            body: this.state.commentContent
          }
        })

        comments = [...this.state.comments]
        const index = comments.findIndex(
          commentObj => commentObj.id === this.state.selectedComment.id
        )
        comments[index].name = this.state.commentName
        comments[index].body = this.state.commentContent
      }

      // if for Add Comment
      else {
        response = await API.post('/comments', {
          data: {
            name: this.state.commentName,
            body: this.state.commentContent
          }
        })

        comments = [...this.state.comments]
        const comment = {
          id: response.data.id,
          ...response.data.data
        }
        comments.push(comment)
      }

      await this.setState({
        comments,
        commentName: '',
        commentContent: ''
      })
    } catch (error) {
      console.log(error)
    } finally {
      await this.setState({
        isSaving: false,
        openDialog: false
      })
    }
  }

  componentDidMount = async () => {
    await this.getComments()
  }

  render() {
    const {
      isFetchingComments,
      comments,
      openDialog,
      commentName,
      commentContent,
      useForEdit,
      isSaving
    } = this.state

    return (
      <div className={classes.comments__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingComments ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            {/* Show lists of comments */}
            <p className={classes.title}>
              Comments from PostID: {this.props.match.params.postId}
            </p>
            <Grid container spacing={24} className={classes.gridContainer}>
              {comments.map(comment => {
                return (
                  <Grid
                    item
                    xs={3}
                    key={comment.id}
                    className={classes.gridItem}
                  >
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <p className={classes.commentName}>{comment.name}</p>
                        <p className={classes.commentBody}>{comment.body}</p>
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                        <Button
                          color="primary"
                          onClick={() => this.onEditClick(comment)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => this.onDeleteComment(comment)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Button add comment */}
            <Fab
              color="primary"
              className={classes.btnAddComment}
              onClick={() => this.onAddClick()}
            >
              <AddIcon />
            </Fab>

            {/* Add or Edit Dialog */}
            <Dialog open={openDialog} onClose={this.onDialogClose} fullWidth>
              <DialogTitle>{useForEdit ? 'Edit' : 'Add'} Comment</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={commentName}
                  onChange={event =>
                    this.setState({ commentName: event.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  label="Comment"
                  type="text"
                  variant="outlined"
                  multiline
                  rows="5"
                  rowsMax="5"
                  fullWidth
                  value={commentContent}
                  onChange={event =>
                    this.setState({ commentContent: event.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.onDialogClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.onDialogSave} color="secondary">
                  {isSaving ? (
                    <CircularProgress />
                  ) : useForEdit ? (
                    'Update Comment'
                  ) : (
                    'Add Comment'
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    )
  }
}

export default Comments

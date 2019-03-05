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

import classes from './posts.module.scss'

import API from '../../services/services'

class Posts extends Component {
  state = {
    isFetchingPosts: true,
    posts: [],

    // For Add or Edit Post
    selectedPost: {},
    useForEdit: false,
    openDialog: false,
    isSaving: false,
    postTitle: '',
    postContent: ''
  }

  getPosts = async () => {
    try {
      await this.setState({
        isFetchingPosts: true
      })

      const response = await API.get('/posts', {
        params: {
          userId: this.props.match.params.userId
        }
      })
      await this.setState({
        posts: response.data
      })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({
        isFetchingPosts: false
      })
    }
  }

  onCommentsClick = post => {
    this.props.history.push(
      `/users/${this.props.match.params.userId}/posts/${post.id}/comments`
    )
  }

  onDeletePost = async post => {
    try {
      await API.delete(`/posts/${post.id}`)

      const posts = [...this.state.posts]
      const index = posts.findIndex(postObj => postObj.id === post.id)
      posts.splice(index, 1)

      await this.setState({ posts })
    } catch (error) {
      console.log(error)
    }
  }

  onEditClick = async post => {
    await this.setState({
      useForEdit: true,
      openDialog: true,
      postTitle: post.title,
      postContent: post.body,
      selectedPost: post
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
      postTitle: '',
      postContent: ''
    })
  }

  onDialogSave = async () => {
    try {
      await this.setState({ isSaving: true })

      let response, posts

      // If used for Edit Post
      if (this.state.useForEdit) {
        response = await API.put(`/posts/${this.state.selectedPost.id}`, {
          data: {
            id: this.state.selectedPost.id,
            title: this.state.postTitle,
            body: this.state.postContent,
            userId: this.props.match.params.userId
          }
        })

        posts = [...this.state.posts]
        const index = posts.findIndex(
          postObj => postObj.id === this.state.selectedPost.id
        )
        posts[index].title = this.state.postTitle
        posts[index].body = this.state.postContent
      }

      // if for Add Post
      else {
        response = await API.post('/posts', {
          data: {
            title: this.state.postTitle,
            body: this.state.postContent,
            userId: this.props.match.params.userId
          }
        })

        posts = [...this.state.posts]
        const post = {
          id: response.data.id,
          ...response.data.data
        }
        posts.push(post)
      }

      await this.setState({
        posts,
        postTitle: '',
        postContent: ''
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
    await this.getPosts()
  }

  render() {
    const {
      isFetchingPosts,
      posts,
      openDialog,
      postTitle,
      postContent,
      useForEdit,
      isSaving
    } = this.state

    return (
      <div className={classes.posts__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingPosts ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            {/* Show lists of posts */}
            <p className={classes.title}>
              Posts from UserID: {this.props.match.params.userId}
            </p>
            <Grid container spacing={24} className={classes.gridContainer}>
              {posts.map(post => {
                return (
                  <Grid item xs={3} key={post.id} className={classes.gridItem}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <p className={classes.postTitle}>{post.title}</p>
                        <p className={classes.postBody}>{post.body}</p>
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                        <Button
                          color="default"
                          onClick={() => this.onCommentsClick(post)}
                        >
                          Comments
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => this.onEditClick(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => this.onDeletePost(post)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Button add post */}
            <Fab
              color="primary"
              className={classes.btnAddPost}
              onClick={() => this.onAddClick()}
            >
              <AddIcon />
            </Fab>

            {/* Add or Edit Dialog */}
            <Dialog open={openDialog} onClose={this.onDialogClose} fullWidth>
              <DialogTitle>{useForEdit ? 'Edit' : 'Add'} Post</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={postTitle}
                  onChange={event =>
                    this.setState({ postTitle: event.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  label="Content"
                  type="text"
                  variant="outlined"
                  multiline
                  rows="5"
                  rowsMax="5"
                  fullWidth
                  value={postContent}
                  onChange={event =>
                    this.setState({ postContent: event.target.value })
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
                    'Update Post'
                  ) : (
                    'Add Post'
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

export default Posts

import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import classes from './posts.module.scss'

import API from '../../services/services'

class Posts extends Component {
  state = {
    isFetchingPosts: true,
    posts: []
  }

  getPosts = async () => {
    try {
      await this.setState({
        isFetchingPosts: true
      })

      const response = await API.get(this.props.location.pathname)
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

  componentDidMount = async () => {
    await this.getPosts()
  }

  render() {
    const { isFetchingPosts, posts } = this.state

    return (
      <div className={classes.posts__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingPosts ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            {/* Show lists of users */}
            <p className={classes.title}>Please select a post</p>
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
                        <Button color="secondary" onClick={() => {}}>
                          Comments
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </>
        )}
      </div>
    )
  }
}

export default Posts

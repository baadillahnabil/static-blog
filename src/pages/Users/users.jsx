import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

import classes from './users.module.scss'

import API from '../../services/services'

class Users extends Component {
  state = {
    isFetchingUsers: true,
    users: []
  }

  getUsers = async () => {
    try {
      await this.setState({
        isFetchingUsers: true
      })

      const response = await API.get('/users')
      await this.setState({
        users: response.data
      })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({
        isFetchingUsers: false
      })
    }
  }

  onActionsClick = async (user, to) => {
    this.props.history.push(`user/${user.id}/${to}`)
  }

  componentDidMount = async () => {
    await this.getUsers()
  }

  render() {
    const { isFetchingUsers, users } = this.state

    return (
      <div className={classes.users__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingUsers ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            {/* Show lists of users */}
            <p className={classes.title}>Users</p>
            <Grid container spacing={24} className={classes.gridContainer}>
              {users.map(user => {
                return (
                  <Grid item xs={2} key={user.id} className={classes.gridItem}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Avatar
                          alt="user_pic"
                          src="https://via.placeholder.com/150"
                          className={classes.userPic}
                        />
                        <p className={classes.userName}>{user.name}</p>
                        <p className={classes.userEmail}>{user.email}</p>
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                        <Button
                          color="primary"
                          onClick={() => this.onActionsClick(user, 'posts')}
                        >
                          Posts
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => this.onActionsClick(user, 'albums')}
                        >
                          Albums
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

export default Users

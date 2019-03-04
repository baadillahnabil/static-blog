import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Avatar from '@material-ui/core/Avatar'

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

  componentDidMount = async () => {
    await this.getUsers()
  }

  render() {
    const { isFetchingUsers, users } = this.state

    return (
      <div className={classes.users__page}>
        {isFetchingUsers ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            <p className={classes.title}>Please select a user</p>
            <Grid container spacing={24} className={classes.gridContainer}>
              {users.map(user => {
                return (
                  <Grid item xs={2} key={user.id} className={classes.gridItem}>
                    <Card className={classes.card}>
                      <CardActionArea className={classes.cardArea}>
                        <Avatar
                          alt="user_pic"
                          src="https://via.placeholder.com/150"
                          className={classes.userPic}
                        />
                        <p className={classes.userName}>{user.name}</p>
                        <p className={classes.userEmail}>{user.email}</p>
                      </CardActionArea>
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

import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import classes from './app.module.scss'

// Pages
import Users from '../pages/Users/users'
import Posts from '../pages/Posts/posts'

class App extends Component {
  render() {
    return (
      <div className={classes.rootPages}>
        <Switch>
          <Route path="/" exact component={Users} />
          <Route path="/user/:userId/posts" component={Posts} />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    )
  }
}

export default App

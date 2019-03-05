import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import classes from './app.module.scss'

// Pages
import Users from '../pages/Users/users'
import Posts from '../pages/Posts/posts'
import Albums from '../pages/Albums/albums'
import Comments from '../pages/Comments/comments'

class App extends Component {
  render() {
    return (
      <div className={classes.rootPages}>
        <Switch>
          <Route path="/" exact component={Users} />
          <Route path="/users/:userId/posts" exact component={Posts} />
          <Route
            path="/users/:userId/posts/:postId/comments"
            component={Comments}
          />
          <Route path="/users/:userId/albums" component={Albums} />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    )
  }
}

export default App

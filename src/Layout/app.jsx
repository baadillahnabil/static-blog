import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import classes from './app.module.scss'

// Pages
import Users from '../pages/Users/users'

class App extends Component {
  render() {
    return (
      <div className={classes.rootPages}>
        <Switch>
          <Route path="/" exact component={Users} />
        </Switch>
      </div>
    )
  }
}

export default App

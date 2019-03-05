import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import classes from './albums.module.scss'

import API from '../../services/services'

class Albums extends Component {
  state = {
    isFetchingAlbums: true,
    albums: []
  }

  getAlbums = async () => {
    try {
      await this.setState({
        isFetchingAlbums: true
      })

      const response = await API.get(this.props.location.pathname)
      await this.setState({
        albums: response.data
      })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({
        isFetchingAlbums: false
      })
    }
  }

  componentDidMount = async () => {
    await this.getAlbums()
  }

  render() {
    const { isFetchingAlbums, albums } = this.state

    return (
      <div className={classes.albums__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingAlbums ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>{/* Show lists of albums */}</>
        )}
      </div>
    )
  }
}

export default Albums

import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import isEmpty from 'lodash/isEmpty'

import classes from './albums.module.scss'

import API from '../../services/services'

class Albums extends Component {
  state = {
    isFetchingAlbums: false,
    albums: [],
    expanded: null
  }

  getAlbums = async () => {
    try {
      await this.setState({
        isFetchingAlbums: true
      })

      const response = await API.get('albums', {
        params: {
          userId: this.props.match.params.userId
        }
      })

      const albums = []
      for (const album of response.data) {
        const item = {
          ...album,
          photos: [],
          isFetchingPhotos: false
        }

        albums.push(item)
      }

      await this.setState({ albums })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({
        isFetchingAlbums: false
      })
    }
  }

  onExpandChange = album => async (event, expanded) => {
    await this.setState({
      expanded: expanded ? album.id : false
    })

    if (!isEmpty(album.photos)) return

    const matchIndex = this.state.albums.findIndex(
      albumObj => albumObj.id === album.id
    )
    const albums = [...this.state.albums]

    albums[matchIndex].isFetchingPhotos = true
    await this.setState({ albums })
    setTimeout(() => {
      this.getPhotos(album)
    }, 1500)
  }

  getPhotos = async album => {
    const matchIndex = this.state.albums.findIndex(
      albumObj => albumObj.id === album.id
    )
    const albums = [...this.state.albums]

    try {
      albums[matchIndex].isFetchingPhotos = true
      await this.setState({ albums })

      const response = await API.get('photos', {
        params: {
          albumId: album.id
        }
      })

      albums[matchIndex].photos = response.data
      await this.setState({ albums })
    } catch (error) {
      console.log(error)
    } finally {
      albums[matchIndex].isFetchingPhotos = false
      await this.setState({ albums })
    }
  }

  componentDidMount = async () => {
    await this.getAlbums()
  }

  render() {
    const { isFetchingAlbums, albums, expanded } = this.state

    return (
      <div className={classes.albums__page}>
        {/* Show loading if still fetching the data from API */}
        {isFetchingAlbums ? (
          <div className={classes.loading}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            {/* Show lists of albums */}
            <p className={classes.title}>Albums</p>
            {albums.map(album => (
              <ExpansionPanel
                expanded={expanded === album.id}
                onChange={this.onExpandChange(album)}
                key={album.id}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <p className={classes.albumTitle}>{album.title}</p>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {/* Show Photos here */}
                  {album.isFetchingPhotos ? (
                    <div className={classes.loading}>
                      <CircularProgress color="primary" />
                    </div>
                  ) : (
                    <>
                      <p>Done</p>
                    </>
                  )}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </>
        )}
      </div>
    )
  }
}

export default Albums

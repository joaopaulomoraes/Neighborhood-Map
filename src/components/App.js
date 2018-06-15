import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  withStyles,
  MuiThemeProvider
} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import MenuIcon from '@material-ui/icons/Menu'
import Theme from '../utils/theme'
import {
  loadMapJS,
  mapStyles,
  locations
} from '../utils/helpers'
import LocationsDrawer from './LocationsDrawer'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

const drawerWidth = 320

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    backgroundColor: theme.palette.background.default
  }
})

class App extends Component {
  state = {
    map: {},
    markers: [],
    locations: [],
    infowindow: [],
    query: "",
    prevmarker: null,
    mobileOpen: false
  }

  componentDidMount() {
    window.initMap = this.initMap
    loadMapJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyCTUTg0Cyq-SghJ6RjtAECKNwJhVbe6mRM&callback=initMap")
  }

  initMap = () => {
    const google = window.google
    const { markers } = this.state

    const map = new google.maps.Map(document.getElementById('map'), {
      styles: mapStyles,
      center: {
        lat: -22.8841808,
        lng: -48.4441653
      },
      zoom: 12
    })
  
    const largeInfowindow = new google.maps.InfoWindow()
    
    let apiLocations = []
    locations.forEach(location => {
      
      const position = location.location
      const title = location.title

      const marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP
      })

      location.marker = marker
      apiLocations.push(location)
      
      google.maps.event.addListener(largeInfowindow, 'closeclick', () => {
        this.closeInfoWindow()
      })

      this.setState({
        infowindow: largeInfowindow,
        markers: markers.push(marker)
      })

      marker.addListener('click', () => {
        this.openInfoWindow(marker)
      })

      google.maps.event.addListener(map, 'click', () => {
        this.closeInfoWindow()
      })
    })

    const bounds = new google.maps.LatLngBounds()
    markers.forEach(marker => bounds.extend(marker.position))

    map.fitBounds(bounds)
    this.setState({ map, locations: apiLocations })
  }

  openInfoWindow = marker => {
    this.closeInfoWindow()
    this.state.infowindow.open(this.state.map, marker)
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    this.setState({ prevmarker: marker })
    this.state.infowindow.setContent('Loading...')
    this.getLocateDetails(marker)
  }

  closeInfoWindow = () => {
    if (this.state.prevmarker) this.state.prevmarker.setAnimation(null)
    this.setState({ prevmarker: null })
    this.state.infowindow.close()
  }

  getLocateDetails = marker => {
    var self = this
    var clientId = 'BWTXXC02BX1H0330CQYTEMFMTYNE3LJXBR25JE1G3WIPGM1R'
    var clientSecret = 'GGLM4LYCZA2XEBO5CSOMVDZTUMJNLCHUT0JYN4YZOSOAIP4C'
    var url = `https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&v=20130815&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&lim it=1`
    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data can't be loaded")
          return
        }

        response.json().then(data => {
          var location = data.response.venues[0]
          var verified = `
            <b>Name</b>: ${location.name}<br>
            <b>Verified Location: </b> ${location.verified ? 'Yes' : 'No'}<br>
            <b>Number of CheckIn: </b> ${location.stats.checkinsCount} <br>
            <b>Number of Users: </b> ${location.stats.usersCount}<br>
            <b>Number of Tips: </b> ${location.stats.tipCount}<br>
            <p>
              <a href="https://foursquare.com/v/${location.id}" target="_blank">More details on Foursquare</a>
            </p>`
          self.state.infowindow.setContent(
            verified
          )
        })
      })
      .catch(() => {
        self.state.infowindow.setContent("Sorry data can't be loaded")
      })
  }

  filterMarkers = query => {
    this.closeInfoWindow()
    this.setState({ query: query.toLowerCase() })

    this.state.locations.forEach((location) => {
      if (location.title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        location.marker.setVisible(true)
        locations.push(location)
      } else {
        location.marker.setVisible(false)
      }
    })
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  render() {
    const { classes, theme } = this.props
    const { locations, query } = this.state

    let filteredLocations
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      filteredLocations = locations.filter(location => match.test(location.title))
    } else {
      filteredLocations = locations
    }
    filteredLocations.sort(sortBy('title'))

    return (
      <div className={classes.root}>
        <CssBaseline />
        <MuiThemeProvider theme={Theme}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                Neighborhood Map
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              <LocationsDrawer
                openInfoWindow={this.openInfoWindow}
                locations={filteredLocations}
                filterMarkers={this.filterMarkers}
              />
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <LocationsDrawer
                openInfoWindow={this.openInfoWindow}
                locations={filteredLocations}
                filterMarkers={this.filterMarkers}
              />
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div id="map" className={classes.content} />
          </main>
        </MuiThemeProvider>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(
  styles,
  { withTheme: true }
)(App)

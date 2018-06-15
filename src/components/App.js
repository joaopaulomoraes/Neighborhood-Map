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
      
      this.setState({
        infowindow: largeInfowindow,
        markers: markers.push(marker)
      })

      marker.addListener('click', () =>
        this.populateInfoWindow(marker, this.state.infowindow)
      )
    })

    const bounds = new google.maps.LatLngBounds()
    markers.forEach(marker => bounds.extend(marker.position))

    map.fitBounds(bounds)
    this.setState({ map, locations: apiLocations })
  }

  populateInfoWindow = (marker, infowindow) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null)
    }

    this.setState({ prevmarker: marker })

    if (infowindow.marker !== marker) {
      infowindow.marker = marker
      infowindow.setContent('<div>' + marker.title + '</div>')
      infowindow.open(this.state.map, marker)
  
      infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null
        this.setState({
          prevmarker: null
        })
        marker.setAnimation(null)
      })
    }
  }

  filterMarkers = query => {
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
                populateInfoWindow={this.populateInfoWindow}
                infoWindow={this.state.infowindow}
                locations={filteredLocations}
                handleDrawerToggle={this.handleDrawerToggle}
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
                populateInfoWindow={this.populateInfoWindow}
                infoWindow={this.state.infowindow}
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

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
  locations
} from '../utils/helpers'
import LocationsDrawer from './LocationsDrawer'

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

const map = [], markers = []

class App extends Component {
  state = {
    locations: [],
    infowindow: [],
    mobileOpen: false
  }

  componentDidMount() {
    this.setState({ locations })
    window.initMap = this.initMap
    loadMapJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyCTUTg0Cyq-SghJ6RjtAECKNwJhVbe6mRM&callback=initMap")
  }

  initMap = () => {
    const google = window.google
    const { locations } = this.state

    const map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -22.8841808,
        lng: -48.4441653
      },
      zoom: 12
    })
  
    const largeInfowindow = new google.maps.InfoWindow()
    const bounds = new google.maps.LatLngBounds()
    
    let apiLocations = []
    for (let i = 0; i < locations.length; i++) {
      
      const position = locations[i].location
      const title = locations[i].title

      const marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      })

      locations[i].marker = marker
      apiLocations.push(locations[i])
      
      this.setState({
        locations: apiLocations,
        infowindow: largeInfowindow
      })

      markers.push(marker)

      marker.addListener('click', () => 
        this.populateInfoWindow(marker, this.state.infowindow)
      )
      bounds.extend(markers[i].position)
    }

    map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow) => {
    if (infowindow.marker !== marker) {
      infowindow.marker = marker
      infowindow.setContent('<div>' + marker.title + '</div>')
      infowindow.open(map, marker)
  
      infowindow.addListener('closeclick', function(){
        infowindow.setMarker = null
      })
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  render() {
    const { classes, theme } = this.props
    const { locations } = this.state

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
                locations={locations}
                handleDrawerToggle={this.handleDrawerToggle}
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
                locations={locations}
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

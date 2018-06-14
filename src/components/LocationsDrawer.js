import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Place from '@material-ui/icons/Place'

const drawerWidth = 320

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  }
})

const LocationsDrawer = props => {
  const {
    classes,
    locations,
    populateInfoWindow,
    infoWindow
  } = props

  return (
    <div id="locations-drawer">
      <div className={classes.toolbar} />
        {locations && locations.map((location, key) => (
          <div key={key}>
            <Divider />
            <List>
              <ListItem button onClick={() => populateInfoWindow(location.marker, infoWindow)}>
                <ListItemIcon>
                  <Place />
                </ListItemIcon>
                <ListItemText primary={`${location.title}`} />
              </ListItem>
            </List>
          </div>
        ))}
    </div>
  )
}

export default withStyles(
  styles,
  { withTheme: true }
)(LocationsDrawer)

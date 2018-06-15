import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Input from '@material-ui/core/Input'
import Place from '@material-ui/icons/Place'

const styles = () => ({
  search: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 35,
    paddingRight: 35,
    width: '100vh'
  }
})

const LocationsDrawer = props => {
  const {
    classes,
    locations,
    openInfoWindow,
    query,
    filterMarkers
  } = props
  
  return (
    <div id="locations-drawer">
      <Input
        className={classes.search}
        placeholder="Filter place"
        defaultValue={query}
        onChange={(e) => filterMarkers(e.target.value)}
        inputProps={{
          'aria-label': 'Description'
        }}
      />
        {locations && locations.map((location, key) => (
          <div key={key}>
            <Divider />
            <List>
              <ListItem button onClick={() => openInfoWindow(location.marker)}>
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

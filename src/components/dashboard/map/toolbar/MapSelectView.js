import React from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import ChromeReaderModeIcon from 'material-ui/svg-icons/action/chrome-reader-mode'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const MapSelectView = ({ onChange, maps }) => (
  <IconMenu
    iconButtonElement={
      <IconButton style={buttonStyle} iconStyle={iconStyle}>
          <ChromeReaderModeIcon color="#545454"/>
      </IconButton>
    }
    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
    targetOrigin={{horizontal: 'left', vertical: 'top'}}
    onItemTouchTap={onChange}
  >
    {
      maps.map(map =>
        <MenuItem value={map.id} key={map.id}>
          {map.name}
        </MenuItem>
      )
    }
  </IconMenu>
)

export default MapSelectView

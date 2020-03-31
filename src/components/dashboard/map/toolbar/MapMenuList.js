import React from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const MapMenuList = ({ onAdd, onRename, onDelete, onSave, onImport }) => (
  <IconMenu
    iconButtonElement={
      <IconButton style={buttonStyle} iconStyle={iconStyle}>
          <SettingsIcon color="#545454"/>
      </IconButton>
    }
    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
    targetOrigin={{horizontal: 'left', vertical: 'top'}}
  >
    <MenuItem onTouchTap={onAdd}>Add Map</MenuItem>
    <MenuItem onTouchTap={onRename}>Rename Map</MenuItem>
    <MenuItem onTouchTap={onDelete}>Delete Map</MenuItem>
    <MenuItem onTouchTap={onSave}>Export Map</MenuItem>
    <MenuItem onTouchTap={onImport}>Import Map</MenuItem>
  </IconMenu>
)

export default MapMenuList

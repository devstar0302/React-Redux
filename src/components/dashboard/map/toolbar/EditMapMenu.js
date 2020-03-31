import React from 'react'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import CreateIcon from 'material-ui/svg-icons/content/create'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const EditMapMenu = ({ onEdit, onUndo }) => (
  <li>
    <IconMenu
      iconButtonElement={
        <IconButton style={buttonStyle} iconStyle={iconStyle}>
            <CreateIcon color="#545454"/>
        </IconButton>
      }
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
      <MenuItem onTouchTap={onEdit}>Edit</MenuItem>
      <MenuItem onTouchTap={onUndo}>Undo</MenuItem>
    </IconMenu>
  </li>
)

export default EditMapMenu

/* class EditMapMenu extends Component {
  onClick () {
    console.log('edit menu clicked')
  }

  render () {
    let isDevicesDisplayed = this.props.isDevicesDisplayed
    return (
      <li className={isDevicesDisplayed ? '' : 'dropdown'}>
        <EditMapHeader
          isDevicesDisplayed={isDevicesDisplayed}
          onClick={this.onClick.bind(this)}
        />
        <EditMapItems
          onClick={this.props.onMapEdit}
          editable={this.props.editable}
        />
      </li>
    )
  }
}

export default EditMapMenu */

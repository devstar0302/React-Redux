import React, { Component } from 'react'
import DeviceMenu from '../DeviceMenu'
import IconButton from 'material-ui/IconButton'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

class DeviceMenuContainer extends Component {
  render () {
    return (
      <li>
        <IconButton
          id="device-menu-button"
          style={buttonStyle}
          iconStyle={iconStyle}
          onTouchTap={this.props.onDeviceMenu}>
            <AddCircleIcon color="#545454"/>
        </IconButton>
        { this.props.isDevicesDisplayed
          ? <DeviceMenu {...this.props}
            onClickItem={this.props.onClickDeviceItem}
            selectedItem={this.props.selectedItem}
            onNewIncident={this.props.onNewIncident}/>
          : null }
      </li>
    )
  }
}

export default DeviceMenuContainer

/* class DeviceMenuContainer extends Component {
  render () {
    let isDevicesDisplayed = this.props.isDevicesDisplayed
    return (
      <li className={isDevicesDisplayed ? '' : 'dropdown'}>
        <EditMapHeader
          isDevicesDisplayed={isDevicesDisplayed}
          onClick={this.props.onDeviceMenu}
        />
        { this.props.isDevicesDisplayed
          ? <DeviceMenu {...this.props}
            onClickItem={this.props.onClickDeviceItem}
            selectedItem={this.props.selectedItem}/>
          : null }
      </li>
    )
  }
}

export default DeviceMenuContainer */

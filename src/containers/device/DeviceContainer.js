import React from 'react'
import Device from 'components/dashboard/map/device/Device'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { openDevice, fetchDevices, fetchDevice } from 'actions'

class DeviceContainer extends React.Component {
  render () {
    return (
      <Device {...this.props} />
    )
  }
}

export default connect(
  state => ({
    devices: state.devices.devices,
    selectedDevice: state.dashboard.selectedDevice }),
  dispatch => ({
    ...bindActionCreators({ openDevice, fetchDevices, fetchDevice }, dispatch)
  })
)(withRouter(DeviceContainer))

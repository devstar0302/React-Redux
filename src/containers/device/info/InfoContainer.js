import React from 'react'
import Info from 'components/dashboard/map/device/info/Info'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateMapDevice,
  updateDeviceCreds
} from 'actions'

class InfoContainer extends React.Component {
  render () {
    return (
      <Info {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice
  }), {
    updateMapDevice,
    updateDeviceCreds
  }
)(withRouter(InfoContainer))

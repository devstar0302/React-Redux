import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { addGroupDevice } from 'actions'

import Devices from 'components/dashboard/map/device/devices/Devices'

class DevicesContainer extends React.Component {
  render () {
    return (
      <Devices {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice
  }), {
    addGroupDevice
  }
)(withRouter(DevicesContainer))

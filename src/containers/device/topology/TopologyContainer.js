import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  addGroupDevice,
  updateGroupDevice,
  removeGroupDevice,

  addGroupLine,
  updateGroupLine,
  removeGroupLine,

  openDevice,
  closeDevice,
  fetchGroupDevicesAndLines
} from 'actions'

import Topology from 'components/dashboard/map/device/topology/Topology'

class TopologyContainer extends React.Component {
  render () {
    return (
      <Topology {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    deviceCategories: state.settings.deviceCategories,
    deviceTemplates: state.settings.deviceTemplates,
    mapDevices: state.devices.mapDevices,
    mapLines: state.devices.mapLines
  }), {
    addGroupDevice,
    updateGroupDevice,
    removeGroupDevice,
    addGroupLine,
    updateGroupLine,
    removeGroupLine,
    openDevice,
    closeDevice,
    fetchGroupDevicesAndLines
  }
)(withRouter(TopologyContainer))

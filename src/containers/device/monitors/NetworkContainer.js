import React from 'react'
import Network from 'components/dashboard/map/device/monitors/NetworkTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceApps,

  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors
} from 'actions'

class NetworkContainer extends React.Component {
  render () {
    return (
      <Network {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    monitorNetworks: state.devices.monitorNetworks,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    fetchDeviceApps,

    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors
  }
)(withRouter(NetworkContainer))

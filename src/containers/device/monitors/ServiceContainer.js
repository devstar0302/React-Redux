import React from 'react'
import Service from 'components/dashboard/map/device/monitors/ServiceTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceProcesses,

  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors
} from 'actions'

class ServiceContainer extends React.Component {
  render () {
    return (
      <Service {...this.props}/>
    )
  }
}

export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    services: state.devices.services,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    fetchDeviceProcesses,

    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors
  }
)(withRouter(ServiceContainer))

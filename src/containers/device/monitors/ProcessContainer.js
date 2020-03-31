import React from 'react'
import Process from 'components/dashboard/map/device/monitors/ProcessTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceProcesses,

  updateSearchParams,
  replaceSearchWfs,
  updateSearchTags,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors,

  updateMonitorQuery,
  updateDeviceAppTab
} from 'actions'

class ProcessContainer extends React.Component {
  render () {
    return (
      <Process {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    processes: state.devices.processes,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime,

    monitorQuery: state.devices.monitorQuery,
    deviceAppTab: state.devices.deviceAppTab
  }),
  {
    fetchDeviceProcesses,

    updateSearchParams,
    replaceSearchWfs,
    updateSearchTags,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors,

    updateMonitorQuery,
    updateDeviceAppTab
  }
)(withRouter(ProcessContainer))

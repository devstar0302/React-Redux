import React from 'react'
import Apps from 'components/dashboard/map/device/monitors/ApplicationTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  fetchDeviceApps,

  updateSearchParams,
  replaceSearchWfs,
  updateSearchTags,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors,

  updateMonitorQuery,
  updateDeviceAppTab
} from 'actions'

class AppsContainer extends React.Component {
  render () {
    return (
      <Apps {...this.props}/>
    )
  }
}

export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    apps: state.devices.apps,
    monitorHotfixes: state.devices.monitorHotfixes,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime,

    monitorQuery: state.devices.monitorQuery,
    deviceAppTab: state.devices.deviceAppTab
  }),
  {
    fetchDeviceApps,

    updateSearchParams,
    replaceSearchWfs,
    updateSearchTags,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors,

    updateMonitorQuery,
    updateDeviceAppTab
  }
)(withRouter(AppsContainer))

import React from 'react'
import Command from 'components/dashboard/map/device/monitors/CommandTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors
} from 'actions'

class CommandContainer extends React.Component {
  render () {
    return (
      <Command {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    monitorCommandResult: state.devices.monitorCommandResult,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors
  }
)(withRouter(CommandContainer))

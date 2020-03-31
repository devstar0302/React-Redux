import React from 'react'
import Users from 'components/dashboard/map/device/monitors/UserTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors,

  showLocalUserModal
} from 'actions'

class UsersContainer extends React.Component {
  render () {
    return (
      <Users {...this.props}/>
    )
  }
}

export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    monitorUsers: state.devices.monitorUsers,
    localUserModalOpen: state.devices.localUserModalOpen,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors,

    showLocalUserModal
  }
)(withRouter(UsersContainer))

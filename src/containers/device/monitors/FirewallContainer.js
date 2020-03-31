import React from 'react'
import Firewall from 'components/dashboard/map/device/monitors/FirewallTable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateSearchParams,
  replaceSearchWfs,
  updateQueryChips,
  updateMonitorRealTime,
  clearMonitors,

  showFwRuleModal
} from 'actions'

class FirewallContainer extends React.Component {
  render () {
    return (
      <Firewall {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    monitorFwRules: state.devices.monitorFwRules,
    monitorFwStatus: state.devices.monitorFwStatus,
    fwRuleModalOpen: state.devices.fwRuleModalOpen,

    params: state.search.params,
    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    updateSearchParams,
    replaceSearchWfs,
    updateQueryChips,
    updateMonitorRealTime,
    clearMonitors,

    showFwRuleModal
  }
)(withRouter(FirewallContainer))

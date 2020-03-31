import React from 'react'
import DeviceDashboard from 'components/dashboard/map/device/dashboard/DeviceDashboard'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

import {
  fetchSysSearchOptions,
  fetchWorkflows,
  fetchDevicesGroups,

  fetchGaugeBoards,
  fetchGauges,
  addDeviceGauge,
  updateDeviceGauge,
  removeDeviceGauge,

  fixIncident,
  ackIncident,

  loadSearch,

  showGaugeModal,
  showGaugePicker,

  updateViewLogParams
} from 'actions'

class DeviceDashboardContainer extends React.Component {
  render () {
    return (
      <DeviceDashboard {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    allDevices: state.devices.deviceAndGroups,

    gauges: state.gauge.gauges,
    gaugeBoards: state.gauge.gaugeBoards,

    mapDevices: state.devices.mapDevices,
    mapLines: state.devices.mapLines,

    userInfo: state.dashboard.userInfo,
    sysSearchOptions: state.search.sysSearchOptions,
    workflows: state.settings.workflows,

    incidentDraw: state.devices.incidentDraw,

    gaugeModalOpen: state.gauge.gaugeModalOpen,
    editGauge: state.gauge.editGauge,
    gaugePickerOpen: state.gauge.gaugePickerOpen,

    logViewParam: state.dashboard.logViewParam
  }), {
    fetchSysSearchOptions,
    fetchWorkflows,
    fetchDevicesGroups,

    fetchGaugeBoards,
    fetchGauges,
    addDeviceGauge,
    updateDeviceGauge,
    removeDeviceGauge,

    fixIncident,
    ackIncident,

    loadSearch,

    showGaugeModal,
    showGaugePicker,

    updateViewLogParams
  }
)(withRouter(DeviceDashboardContainer))

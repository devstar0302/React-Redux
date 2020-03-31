import React, { Component } from 'react'
import Monitors from 'components/dashboard/map/device/monitors/Monitors'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  openDeviceMonitorPicker,
  openDeviceMonitorWizard,
  closeDeviceMonitorWizard,
  updateMapDevice,
  reloadDevice,

  fetchDeviceEventLog,
  fetchDeviceApps,
  fetchDeviceProcesses,
  fetchMonitorTemplates,
  closeDeviceMonitorPicker,
  openProcessModal,
  closeProcessModal,

  updateSearchParams,
  replaceSearchWfs,
  updateSearchTags,
  updateQueryChips,

  fetchMonitorOS,
  fetchMonitorDisk,
  fetchMonitorCpu,
  fetchMonitorMemory,
  updateMonitorRealTime,
  clearMonitors,

  showMonitorHistoryModal,
  showDeviceCpuProcessModal,
  showDeviceMemoryProcessModal,

  fetchCollectors,
  fetchCredentials
} from 'actions'

class MonitorsContainer extends Component {
  render () {
    return (
      <Monitors {...this.props} />
    )
  }
}

export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    monitorPickerVisible: state.devices.monitorPickerVisible,
    monitorWizardVisible: state.devices.monitorWizardVisible,
    process: state.devices.process,
    processModalOpen: state.devices.processModalOpen,
    cpuProcessModalOpen: state.devices.cpuProcessModalOpen,
    memProcessModalOpen: state.devices.memProcessModalOpen,

    monitorHistoryModalOpen: state.devices.monitorHistoryModalOpen,
    selectedMonitor: state.devices.selectedMonitor,

    eventLogs: state.devices.eventLogs,
    apps: state.devices.apps,
    processes: state.devices.processes,
    monitorTemplates: state.settings.monitorTemplates,

    params: state.search.params,

    monitorOS: state.devices.monitorOS,
    monitorDisk: state.devices.monitorDisk,
    monitorCpu: state.devices.monitorCpu,
    monitorMemory: state.devices.monitorMemory,

    monitorsUpdateTime: state.devices.monitorsUpdateTime
  }),
  {
    openDeviceMonitorPicker,
    openDeviceMonitorWizard,
    closeDeviceMonitorWizard,
    updateMapDevice,
    reloadDevice,

    fetchDeviceEventLog,
    fetchDeviceApps,
    fetchDeviceProcesses,
    fetchMonitorTemplates,
    closeDeviceMonitorPicker,
    openProcessModal,
    closeProcessModal,

    updateSearchParams,
    replaceSearchWfs,
    updateSearchTags,
    updateQueryChips,

    fetchMonitorOS,
    fetchMonitorDisk,
    fetchMonitorCpu,
    fetchMonitorMemory,
    updateMonitorRealTime,
    clearMonitors,

    showMonitorHistoryModal,
    showDeviceCpuProcessModal,
    showDeviceMemoryProcessModal,

    fetchCollectors,
    fetchCredentials
  }
)(withRouter(MonitorsContainer))

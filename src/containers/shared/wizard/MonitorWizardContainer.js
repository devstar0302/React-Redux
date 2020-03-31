import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MonitorWizard from 'components/common/wizard/MonitorWizard'

import {
  fetchMonitorTemplates,
  openParamsModal,

  openParamEditModal,
  closeParamsModal,
  removeParam,
  updateMonitorParams,

  showDeviceCredsPicker,

  updateMonitorTags,
  showMonitorTagModal,

  updateMapDevice,

  fetchCollectors
} from 'actions'

class MonitorWizardContainer extends React.Component {
  render () {
    return (
      <MonitorWizard {...this.props} canAddTags checkCreds/>
    )
  }
}

function getRemoveAfter (monitor) {
  const values = {
    remove_after: 1,
    remove_after_unit: 'days'
  }
  if (!monitor || !monitor.params) return values
  const remove_after = parseInt(monitor.params.remove_after || 1, 10)
  if (!remove_after || isNaN(remove_after)) return values
  if (remove_after >= 365) {
    values.remove_after = remove_after / 365
    values.remove_after_unit = 'years'
    return values
  }
  if (remove_after >= 30) {
    values.remove_after = remove_after / 30
    values.remove_after_unit = 'months'
    return values
  }
  values.remove_after = remove_after || 1
  return values
}

export default connect(
  state => ({
    initialValues: {
      agentType: state.dashboard.selectedDevice && state.dashboard.selectedDevice.agent ? 'agent' : 'collector',
      collectorId: state.settings.collectors.length ? state.settings.collectors[0].id : '',
      // credentialId: (state.dashboard.selectedDevice.credentials || []).length ? state.dashboard.selectedDevice.credentials[0].id : '',

      ...state.devices.monitorInitialValues.params,
      checkinterval: ((state.devices.monitorInitialValues.params || {}).checkinterval || 0) / 1000,
      ...getRemoveAfter(state.devices.monitorInitialValues),
      ...state.devices.monitorInitialValues
    },

    paramsModalOpen: state.devices.paramsModalOpen,
    paramEditModalOpen: state.devices.paramEditModalOpen,

    editParams: state.devices.editParams,
    monitorTagModalOpen: state.devices.monitorTagModalOpen,
    monitorTags: state.devices.monitorTags,
    monitorConfig: state.devices.monitorConfig,

    selectedDevice: state.dashboard.selectedDevice,
    deviceCredsPickerVisible: state.devices.deviceCredsPickerVisible,

    collectors: state.settings.collectors,
    credentials: state.settings.credentials
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchMonitorTemplates,
      openParamsModal,

      openParamEditModal,
      closeParamsModal,
      removeParam,
      updateMonitorParams,

      showDeviceCredsPicker,

      updateMonitorTags,
      showMonitorTagModal,

      updateMapDevice,

      fetchCollectors
    }, dispatch)
  })
)(MonitorWizardContainer)

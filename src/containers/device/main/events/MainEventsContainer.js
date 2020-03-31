import React, { Component } from 'react'
import MainEvents from 'components/dashboard/map/device/main/events/MainEvents'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchDeviceEvents,

  openDeviceWorkflowModal,
  fetchDeviceWorkflows,
  removeDeviceWorkflow,

  closeDeviceWorkflowModal,
  addDeviceWorkflow,
  updateDeviceWorkflow,
  fetchWorkflowCategories,
  openDeviceRuleModal,
  closeDeviceRuleModal,
  openWfCategoryModal,
  openWfActionModal,
  closeWfActionModal,
  openDeviceWfDiagramModal,

  addWfCategory,
  closeWfCategoryModal,

  fetchWorkflows,
  openSysWorkflowsModal,
  closeSysWorkflowsModal,
  selectSysWorkflow,
  deselectSysWorkflow,
  addDeviceWorkflows,
  selectSysWorkflowCategory
} from 'actions'

class MainEventsContainer extends Component {
  render () {
    return (
      <MainEvents {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    events: state.devices.events,

    workflows: state.devices.workflows,
    workflowModalOpen: state.devices.workflowModalOpen,
    workflowListDraw: state.devices.workflowListDraw,

    editWorkflow: state.devices.editWorkflow,
    editWfAction: state.devices.editWfAction,
    editWfCategory: state.devices.editWfCategory,
    editRule: state.devices.editRule,

    workflowCategories: state.devices.workflowCategories,
    ruleModalOpen: state.devices.ruleModalOpen,
    wfCategoryModalOpen: state.devices.wfCategoryModalOpen,
    wfActionModalOpen: state.devices.wfActionModalOpen,
    wfDiagramModalOpen: state.devices.wfDiagramModalOpen,

    sysWorkflows: state.settings.workflows,
    sysWorkflowsModalOpen: state.devices.sysWorkflowsModalOpen,
    selectedSysWorkflows: state.devices.selectedSysWorkflows,
    selectedSysWorkflowCategory: state.devices.selectedSysWorkflowCategory
  }), {
    fetchDeviceEvents,

    openDeviceWorkflowModal,
    fetchDeviceWorkflows,
    removeDeviceWorkflow,

    closeDeviceWorkflowModal,
    addDeviceWorkflow,
    updateDeviceWorkflow,
    fetchWorkflowCategories,
    openDeviceRuleModal,
    closeDeviceRuleModal,
    openWfCategoryModal,
    openWfActionModal,
    closeWfActionModal,
    openDeviceWfDiagramModal,

    addWfCategory,
    closeWfCategoryModal,

    fetchWorkflows,
    openSysWorkflowsModal,
    closeSysWorkflowsModal,
    selectSysWorkflow,
    deselectSysWorkflow,
    addDeviceWorkflows,
    selectSysWorkflowCategory
  }
)(withRouter(MainEventsContainer))

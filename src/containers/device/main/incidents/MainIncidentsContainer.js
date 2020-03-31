import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  fixIncident,
  ackIncident,
  fetchDeviceIncidents,
  openAddDeviceIncident,
  closeAddDeviceIncident,
  addDeviceIncident,
  fixAllDeviceIncidents,
  closeDevice,

  replaceSearchWfs,
  updateQueryChips,
  updateSearchParams,
  updateSearchTags,

  fixDeviceIncidents,
  updateDeviceIncident
} from 'actions'

import MainIncidents from 'components/dashboard/map/device/main/incidents/MainIncidents'

class MainIncidentsContainer extends Component {
  render () {
    return (
      <MainIncidents {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,
    incidents: state.devices.incidents,
    incidentDraw: state.devices.incidentDraw,
    addIncidentModalVisible: state.devices.addIncidentModalVisible,
    params: state.search.params,
    userInfo: state.dashboard.userInfo
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchDeviceIncidents,
      fixIncident,
      ackIncident,
      openAddDeviceIncident,
      closeAddDeviceIncident,
      addDeviceIncident,
      fixAllDeviceIncidents,
      closeDevice,

      replaceSearchWfs,
      updateQueryChips,
      updateSearchParams,
      updateSearchTags,

      fixDeviceIncidents,
      updateDeviceIncident
    }, dispatch)
  })
)(withRouter(MainIncidentsContainer))

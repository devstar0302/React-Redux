import React from 'react'
import Advanced from 'components/sidebar/settings/advanced/Advanced'
import { connect } from 'react-redux'
import {withRouter} from 'react-router'

import {
  fetchEnvVars,
  addEnvVar,
  updateEnvVar,
  syncData,
  showImportSyncModal,
  importSyncData,
  showSimulationModal,
  postIncidentSimulation
} from 'actions'

class AdvancedContainer extends React.Component {
  render () {
    return (
      <Advanced {...this.props} />
    )
  }
}

export default connect(
  state => ({
    envVars: state.settings.envVars,
    syncStatus: state.settings.syncStatus,
    importSyncModalOpen: state.settings.importSyncModalOpen,
    simulationModalOpen: state.settings.simulationModalOpen
  }), {
    fetchEnvVars,
    addEnvVar,
    updateEnvVar,
    syncData,
    showImportSyncModal,
    importSyncData,
    showSimulationModal,
    postIncidentSimulation
  }
)(withRouter(AdvancedContainer))

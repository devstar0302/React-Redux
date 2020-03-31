import React from 'react'
import Audit from 'components/sidebar/settings/audit/Audit'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  fetchEnvVars,
  addEnvVar,
  updateEnvVar,

  updateUserOption
} from 'actions'

class AuditContainer extends React.Component {
  render () {
    return (
      <Audit {...this.props} />
    )
  }
}
export default connect(
  state => ({
    envVars: state.settings.envVars,
    userInfo: state.dashboard.userInfo
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchEnvVars,
      addEnvVar,
      updateEnvVar,

      updateUserOption
    }, dispatch)
  })
)(AuditContainer)

import React from 'react'
import Credentials from 'components/sidebar/settings/credentials/Credentials'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import {
  fetchCredentials,
  openCredentialsModal,
  removeCredentials,

  fetchCredTypes,
  addCredentials,
  updateCredentials,
  closeCredentialsModal
} from 'actions'

class CredentialsContainer extends React.Component {
  render () {
    return (
      <Credentials {...this.props} />
    )
  }
}
export default connect(
  state => ({
    credentials: state.settings.credentials,
    credentialsModalVisible: state.settings.credentialsModalVisible,

    editCredentials: state.settings.editCredentials,

    credentialTypes: state.settings.credentialTypes
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchCredentials,
      openCredentialsModal,
      removeCredentials,

      fetchCredTypes,
      addCredentials,
      updateCredentials,
      closeCredentialsModal
    }, dispatch)
  })
)(withRouter(CredentialsContainer))

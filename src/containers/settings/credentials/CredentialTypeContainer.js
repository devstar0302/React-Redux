import React from 'react'
import CredentialTypes from 'components/sidebar/settings/credentials/CredentialTypes'
import { connect } from 'react-redux'

import {
  showCredTypeModal,
  addCredType,
  updateCredType,
  removeCredType
} from 'actions'

class CredentialTypeContainer extends React.Component {
  render () {
    return (
      <CredentialTypes {...this.props} />
    )
  }
}
export default connect(
  state => ({
    credentialTypeDraw: state.settings.credentialTypeDraw,
    credTypeModalOpen: state.settings.credTypeModalOpen,
    editCredType: state.settings.editCredType
  }), {
    showCredTypeModal,
    addCredType,
    updateCredType,
    removeCredType
  }
)(CredentialTypeContainer)

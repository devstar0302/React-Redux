import React, { Component } from 'react'
import Identities from 'components/sidebar/settings/identity/Identities'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchIdentities,
  openIdentityModal,
  removeIdentity,

  closeIdentityModal,
  addIdentity,
  updateIdentity
} from 'actions'

class IdentitiesContainer extends Component {
  render () {
    return (
      <Identities {...this.props} />
    )
  }
}
export default connect(
  state => ({
    identities: state.settings.identities,
    editIdentity: state.settings.editIdentity,
    identityModalVisible: state.settings.identityModalVisible
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchIdentities,
      openIdentityModal,
      removeIdentity,

      closeIdentityModal,
      addIdentity,
      updateIdentity
    }, dispatch)
  })
)(IdentitiesContainer)

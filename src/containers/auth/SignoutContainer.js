import React, { Component } from 'react'
import Signout from 'components/auth/Signout'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signOut } from 'actions'

class SignoutContainer extends Component {
  render () {
    return (
      <Signout {...this.props} />
    )
  }
}
export default connect(
  state => ({ errorMessage: state.auth.error }),
  dispatch => ({
    signOut: bindActionCreators(signOut, dispatch)
  })
)(SignoutContainer)

import React, { Component } from 'react'
import MainAdvanced from 'components/dashboard/map/device/main/advanced/MainAdvanced'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

class MainAdvancedContainer extends Component {
  render () {
    return (
      <MainAdvanced {...this.props} />
    )
  }
}
export default connect(
  state => ({ device: state.dashboard.selectedDevice })
)(withRouter(MainAdvancedContainer))

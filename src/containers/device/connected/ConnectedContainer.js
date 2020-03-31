import React from 'react'
import Connected from 'components/dashboard/map/device/connected/Connected'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

class ConnectedContainer extends React.Component {
  render () {
    return (
      <Connected {...this.props} />
    )
  }
}
export default connect(
  state => ({ device: state.dashboard.selectedDevice })
)(withRouter(ConnectedContainer))

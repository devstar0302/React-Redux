import React from 'react'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

import LogView from 'components/dashboard/log/LogView'

import {
  updateViewLogParams,
  showDetailLogModal
} from 'actions'

class LogViewContainer extends React.Component {
  render () {
    return (
      <LogView {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    logViewParam: state.dashboard.logViewParam,

    detailLogModalOpen: state.dashboard.detailLogModalOpen,
    detailLogViewParam: state.dashboard.detailLogViewParam
  }), {
    updateViewLogParams,
    showDetailLogModal
  }
)(withRouter(LogViewContainer))

import React from 'react'
import { connect } from 'react-redux'

import ThreatMap from 'components/sidebar/threatmap/ThreatMap'
import {
  showThreatItemModal
} from 'actions'
class ThreatMapContainer extends React.Component {
  render () {
    return (
      <ThreatMap {...this.props}/>
    )
  }
}

export default connect(
  state => ({
    threatItemModalOpen: state.dashboard.threatItemModalOpen,
    threatItem: state.dashboard.threatItem
  }), {
    showThreatItemModal
  }
)(ThreatMapContainer)

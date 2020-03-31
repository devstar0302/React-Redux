import React from 'react'

import GaugeModalView from './GaugeModalView'

export default class GaugeModal extends React.Component {
  onHide () {
    this.props.showGaugeModal(false)
  }
  render () {
    const {editGauge} = this.props
    return (
      <GaugeModalView
        {...this.props}
        title={editGauge.name || 'Gauge'}
        onHide={this.onHide.bind(this)}
      />
    )
  }
}

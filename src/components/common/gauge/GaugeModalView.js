import React from 'react'

import {Modal} from 'components/modal/parts'

import GaugeMap from 'components/common/gauge/GaugeMap'

export default class GaugeModalView extends React.Component {

  renderGauge (p) {
    let GaugePanel = GaugeMap[p.templateName || 'z']
    if (!GaugePanel) return <div/>
    return (
      <GaugePanel
        {...this.props}
        gauge={this.props.editGauge}
        device={{id: p.deviceId}}
        modalView
      />
    )
  }

  render () {
    const {title, onHide, editGauge} = this.props
    return (
      <Modal title={title} onRequestClose={onHide} contentStyle={{width: 1000, maxWidth: 'initial'}}>
        <div className="flex-vertical" style={{height: 600}}>
          {this.renderGauge(editGauge)}
        </div>
      </Modal>
    )
  }
}

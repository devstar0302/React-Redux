import React from 'react'
import {findIndex} from 'lodash'

import FlipView from './FlipView'
import MonitorStatusView from './display/MonitorStatusView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'

export default class GMonitors extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      loading: false
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
  }

  onClickDelete () {
    this.props.removeDeviceGauge(this.props.gauge, this.props.device)
  }

  onSubmit (options, values) {
    console.log(values)

    if (!values.name) {
      showAlert('Please type name.')
      return
    }
    const gauge = {
      ...this.props.gauge,
      ...values
    }

    this.props.updateDeviceGauge(gauge, this.props.device)
    options.onClickFlip()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderItem (monitorId) {
    let {device, devices} = this.props
    if (devices) {
      const devIndex = findIndex(devices, {id: device.id})
      if (devIndex >= 0) device = devices[devIndex]
    }
    const index = findIndex(device.monitors, {uid: monitorId})
    if (index < 0) return null
    const monitor = device.monitors[index]
    const isUp = monitor.status === 'UP'
    const lastUpdate = isUp ? monitor.lastfalure : monitor.lastsuccess
    return (
      <div key={monitorId} className="col-md-6" style={{height: '50%'}}>
        <MonitorStatusView isUp={isUp} lastUpdate={lastUpdate} title={monitor.name}/>
      </div>
    )
  }
  renderFrontView () {
    const {gauge} = this.props

    return (
      <div className="row" style={{height: '100%', paddingLeft: 16, paddingRight: 16}}>
        {(gauge.monitorIds || []).slice(0, 4).map(p => this.renderItem(p))}
      </div>
    )
  }
  renderBackView (options) {
    return (
      <GEditView
        {...this.props}
        onSubmit={this.onSubmit.bind(this, options)}
        hideDuration
        hideSplit
      />
    )
  }
  render () {
    return (
      <FlipView
        {...this.props}

        style={this.props.style}
        className={this.props.className}
        gauge={this.props.gauge}

        loading={this.state.loading}
        renderFrontView={this.renderFrontView}
        renderBackView={this.renderBackView}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}

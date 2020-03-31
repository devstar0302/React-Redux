import React from 'react'
import {findIndex} from 'lodash'

import FlipView from './FlipView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'
import {filterGaugeServers} from 'shared/Global'

export default class GServers extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
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

  onClickDelete () {
    this.props.removeDeviceGauge(this.props.gauge, this.props.device)
  }

  getServers () {
    const allDevices = filterGaugeServers(this.props.allDevices || this.props.devices)
    const {gauge}= this.props
    if (!gauge.servers || !gauge.servers.length) return allDevices
    return gauge.servers.map(p => {
      const index = findIndex(allDevices, {id: p.id})
      if (index < 0) return {
        id: p.monitorId || p.id,
        name: p.name
      }

      const device = allDevices[index]
      if (p.type === 'device') return device

      const monitorIndex = findIndex(device.monitors, {uid: p.monitorId})
      if (monitorIndex < 0) return {
        id: p.monitorId,
        name: p.name
      }

      const monitor = device.monitors[monitorIndex]
      return {
        id: monitor.uid,
        name: monitor.name,
        status: monitor.status,
        templateName: monitor.monitortype
      }
    })
  }

  getMaxItemCount (allDevices) {
    const {gauge}= this.props

    const w = Math.max(Math.min(Math.ceil(allDevices.length / (gauge.itemSize === 'slim' ? 24 : 16)), 3), 1)

    return w * (gauge.itemSize === 'slim' ? 24 : 16)
  }

  onClickItem (device) {
    const {gauge, selectGaugeBoard} = this.props
    if (gauge.forward && gauge.forwardBoardId) {
      if (selectGaugeBoard) {
        selectGaugeBoard(gauge.forwardBoardId)
      } else {
        this.props.history.push({
          pathname: '/dashboard',
          search: `id=${gauge.forwardBoardId}`
        })
      }
    } else {
      this.props.history.push(`/device/${device.id}/dashboard`)
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderMonitorItems (device) {
    const {gauge} = this.props
    return (device.monitors || []).map(monitor =>{
      const isUp = monitor.status === 'UP'
      return (
        <div key={monitor.uid} className={`server-cell ${gauge.itemSize === 'slim' ? 'slim' : ''}`}>
          <div
            className={`${isUp ? 'bg-success' : 'bg-danger'}`} style={{width: '100%', height: '100%', cursor: 'pointer'}}
            onClick={this.onClickItem.bind(this, device)}>
            <div className="div-center text-white">
              <div>{monitor.name}</div>
              {gauge.showDeviceType && <div><small>{monitor.monitortype}</small></div>}
            </div>
          </div>
        </div>
      )
    })
  }
  renderItemView(item, total) {
    const {gauge} = this.props
    const isUp = item.status === 'UP'
    // const colCount = (gauge.itemSize === 'slim' ? 3 : 4) * Math.ceil(total / (gauge.itemSize === 'slim' ? 24 : 16))
    // const colCount = 5
    // const col = 100.0 / colCount
    // const rowCount = Math.max(5, Math.ceil(total / colCount))
    // const row = 100.0 / rowCount / (gauge.itemSize === 'slim' ? 2 : 1)
    return [
      <div key={item.id} className={`server-cell ${gauge.itemSize === 'slim' ? 'slim' : ''}`}>
        <div
          className={`${isUp ? 'bg-success' : 'bg-danger'}`} style={{width: '100%', height: '100%', cursor: 'pointer'}}
          onClick={this.onClickItem.bind(this, item)}>
          <div className="div-center text-white">
            <div>{item.name}</div>
            {gauge.showDeviceType && <div><small>{item.templateName}</small></div>}
          </div>
        </div>
      </div>,
      ...this.renderMonitorItems(item)
    ]
  }
  renderFrontView () {
    const items = this.getServers()
    return (
      <div className="flex-vertical flex-1">
        <div className="flex-1" style={{overflow: 'hidden'}}>
          <div style={{height: '100%', overflow: 'auto'}}>
          {items.map(item => this.renderItemView(item, items.length))}
          </div>
        </div>
      </div>
    )
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
          hideDuration
          hideSplit
        />
      </div>
    )
  }
  render () {
    return (
      <FlipView
        {...this.props}

        hideHeader
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

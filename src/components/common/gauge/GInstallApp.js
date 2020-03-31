import React from 'react'
import moment from 'moment'

import FlipView from './FlipView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'
import MonitorSocket from 'util/socket/MonitorSocket'
import InfiniteTable from 'components/common/InfiniteTable'

export default class GInstallApp extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      apps: []
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)

    this.columns = [{
      'displayName': 'Name',
      'columnName': 'Name'
    }, {
      'displayName': 'InstallDate',
      'columnName': 'InstallDate',
      'cssClassName': 'width-140',
      'customComponent': (props) => {
        let val = props.data
        if (!val) return <span />
        val = `${val.substring(0, 4)}-${
          val.substring(4, 6)}-${
          val.substring(6)}`

        return <span>{val}</span>
      }
    }, {
      'displayName': 'Version',
      'columnName': 'Version',
      'cssClassName': 'width-120'
    }, {
      'displayName': 'Publisher',
      'columnName': 'Publisher',
      'cssClassName': 'width-200'
    }, {
      'displayName': 'Size',
      'columnName': 'Size',
      'cssClassName': 'width-120'
    }]
  }

  componentDidMount () {
    this.monitorSocket = new MonitorSocket({
      listener: this.onMonitorMessage.bind(this)
    })
    this.monitorSocket.connect(this.onSocketOpen.bind(this))
  }

  componentWillUnmount () {
    this.monitorSocket && this.monitorSocket.close()
  }

  onSocketOpen () {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'app',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      const {app} = msg.data
      this.setState({
        apps: app.map((u, i) => ({...u, id: i}))
      })
    }
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

  getApps () {
    const {gauge} = this.props
    const {apps} = this.state
    const dateFrom = moment().add(-gauge.duration, `${gauge.durationUnit}s`).startOf('day').valueOf()
    return apps.filter(p => moment(p.InstallDate, 'YYYY-MM-DD').valueOf() >= dateFrom)
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  renderFrontView () {
    return (
      <div className="flex-vertical flex-1">
        <InfiniteTable
          cells={this.columns}
          ref="table"
          rowMetadata={{'key': 'id'}}
          selectable
          data={this.getApps()}
          useExternal={false}
        />
      </div>
    )
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
          hideSplit
        />
      </div>
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

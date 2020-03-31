import React from 'react'
import moment from 'moment'
import axios from 'axios'
import {findIndex} from 'lodash'

import FlipView from './FlipView'
import LiquidView from './display/LiquidView'
import AccelView from './display/AccelMeterView'
import GEditView from './GEditView'
import LineChart from './display/LineChart'
import BarChart from './display/BarChart'

import MonitorSocket from 'util/socket/MonitorSocket'

import {showAlert} from 'components/common/Alert'
import { ROOT_URL } from 'actions/config'

const sampleData = []

const chartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  elements: {
    line: {
      tension: 0
    }
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: true,
      ticks: {
        fontColor: '#9e9e9e',
        min: 0
      },
      gridLines: {
        display: true,
        drawBorder: false
      }
    }]
  }
}

export default class GCpu extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      loading: false,
      cpu: null,
      searchRecordCounts: []
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
  }

  componentDidMount () {
    if (this.props.gauge.timing === 'realtime') {
      this.monitorSocket = new MonitorSocket({
        listener: this.onMonitorMessage.bind(this)
      })
      this.monitorSocket.connect(this.onSocketOpen.bind(this))
    } else {
      this.fetchRecordCount(this.props)
    }
  }

  componentWillUnmount () {
    this.monitorSocket && this.monitorSocket.close()
  }

  onSocketOpen () {
    this.monitorSocket.send({
      action: 'enable-realtime',
      monitors: 'basic',
      deviceId: this.props.device.id
    })
  }
  onMonitorMessage (msg) {
    if (msg.action === 'update' && msg.deviceId === this.props.device.id) {
      const {cpu} = msg.data
      if (cpu) this.setState({ cpu })
    }
  }

  fetchRecordCount (props) {
    const {gauge, device, devices} = props
    const {duration, durationUnit, splitUnit} = gauge

    if (gauge.timing !== 'historic') return
    let monitors = device.monitors || []
    if (devices) {
      const devIndex = findIndex(devices, {id: device.id})
      if (devIndex < 0) {
        console.log('CPU Device not found.')
        return
      }
      monitors = devices[devIndex].monitors || []
    }

    const monitorIndex = findIndex(monitors || [], {monitortype: 'cpu'})
    if (monitorIndex < 0) {
      console.log('CPU monitor not found.')
      return
    }
    const monitorId = monitors[monitorIndex].uid

    this.setState({
      loading: true
    })

    let inc = 1
    if (durationUnit === 'month' && splitUnit === 'day') inc = 0
    const dateFrom = moment().add(-duration + inc, `${durationUnit}s`)
      .startOf(durationUnit === 'hour' || duration === 1 ? durationUnit : 'day')
    const dateTo = moment().endOf(durationUnit === 'hour' ? durationUnit : 'day')

    axios.get(`${ROOT_URL}/event/search/findByDate`, {
      params: {
        dateFrom: dateFrom.valueOf(),
        dateTo: dateTo.valueOf(),
        monitorId,
        sort: 'timestamp'
      }
    }).then(res => {
      this.setState({
        searchRecordCounts: res.data._embedded.events.map(p => ({
          date: moment(p.timestamp).format('YYYY-MM-DD HH:mm:ss'),
          count: p.dataobj && p.dataobj.Usage ? (p.dataobj.Usage || 0) : 0
        })),
        loading: false
      })
    })
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
  renderFrontView () {
    const {gauge} = this.props
    if (gauge.timing === 'historic') {
      const {searchRecordCounts} = this.state

      const chartData = {
        labels: (searchRecordCounts || sampleData).map(p => p.date),
        datasets: [{
          data: (searchRecordCounts || sampleData).map(p => p.count),
          borderWidth: 2,
          borderColor: '#0288d1',
          fill: false,
          pointRadius: 0,
          pointHitRadius: 20
        }]
      }

      return (
        <div className="flex-1" style={{overflow: 'hidden'}}>
          {gauge.gaugeType === 'bar' ? (
            <BarChart chartData={chartData} chartOptions={chartOptions} />
          ) : (
            <LineChart chartData={chartData} chartOptions={chartOptions} />
          )}
        </div>
      )
    } else {
      const {cpu} = this.state
      const value = cpu ? (cpu.length ? cpu[0].Usage : cpu.Usage) : 0
      const title = gauge.name

      return gauge.gaugeType === 'accel' ? (
        <div className="flex-1 flex-vertical">
          <AccelView value={value} title={title}/>
        </div>
      ) : (
        <div className="flex-vertical flex-1">
          <LiquidView value={value}/>
        </div>
      )
    }
  }
  renderBackView (options) {
    return (
      <div>
        <GEditView
          {...this.props}
          onSubmit={this.onSubmit.bind(this, options)}
        />
      </div>
    )
  }
  render () {
    const {gauge} = this.props
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

        hideContentPadding={gauge.timing !== 'historic' && gauge.gaugeType !== 'accel'}

        onClickDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}

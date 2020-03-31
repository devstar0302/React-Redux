import React from 'react'
import moment from 'moment'
// import {IconButton} from 'material-ui'
// import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

import FlipView from './FlipView'
import GEditView from './GEditView'

import {showAlert} from 'components/common/Alert'
import {getRanges} from 'components/common/DateRangePicker'

import {dateFormat} from 'shared/Global'

export default class GLog extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      value: parseInt(Math.random() * 100, 10),
      draw: 1,
      hover: false
    }
    this.renderBackView = this.renderBackView.bind(this)
    this.renderFrontView = this.renderFrontView.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
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

  onClickRefresh () {
    this.props.fetchDevicesGroups()
  }

  onMouseEnter () {
    this.setState({hover: true})
  }

  onMouseOut () {
    this.setState({hover: false})
  }
  getLogMonitors () {
    const {devices, gauge} = this.props

    let monitors = []

    const monitorIds = (gauge.servers || []).map(p => p.monitorId)
    devices.forEach(device => {
      monitors = monitors.concat((device.monitors || []).filter(monitor => monitorIds.includes(monitor.uid)))
    })
    return monitors
  }
  onClickLog (monitor) {
    const ranges = getRanges()
    setTimeout(() => {
      this.props.history.push('/viewlog')
      this.props.updateViewLogParams({
        ...this.props.logViewParam,
        query: '',
        monitorId: monitor.uid,
        dateFrom: ranges['Ever'][0].format(dateFormat),
        dateTo: ranges['Ever'][1].format(dateFormat)
      }, this.props.history)
    }, 1)
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderFrontView () {
    return (
      <div className="flex-vertical flex-1" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseOut}>
        <div className="flex-1" style={{overflow: 'auto'}}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Log</th>
                <th>Changed</th>
              </tr>
            </thead>
            <tbody>
            {this.getLogMonitors().map(p =>
              <tr key={p.uid} style={{cursor: 'pointer'}} onClick={this.onClickLog.bind(this, p)}>
                <td>
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAiElEQVQoz72NMQrDMAxFdRbfqfcQmkKmQkedonMpdMk5SsmUQVf4uyHwO9ihNqZbqd6opycREXkkh1JplYn3k7TjmLkig8FgZCjnXjFudVlQ3tBVjO2aoWRc0VRGoTDxi3BgvxaOz4X/FzLGwo5GeGG83z6C48In9k5acaajCktyGHuUjiWJvAGUIE/eIh8szwAAAABJRU5ErkJggg=="
                    width="16" className="valign-middle" alt=""/>
                  <span className="valign-middle margin-md-left">{p.name}</span>
                </td>
                <td>{p.lastrun ? moment(p.lastrun).fromNow() : ''}</td>
              </tr>
            )}
            </tbody>
          </table>
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

        onClickRefresh={this.onClickRefresh.bind(this)}
      />
    )
  }
}

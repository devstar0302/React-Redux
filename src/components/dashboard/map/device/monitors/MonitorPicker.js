import React from 'react'
import { extImageBaseUrl } from 'shared/Global'
import MonitorPickerView from './MonitorPickerView'

export default class MonitorPicker extends React.Component {
  componentWillMount () {
    this.props.fetchMonitorTemplates()
  }

  onClickClose () {
    this.props.closeDeviceMonitorPicker()
  }

  onClickItem (item) {
    if (!this.props.onClickItem) return
    if (this.props.onClickItem(item)) {
      this.onClickClose()
    }
  }

  render () {
    return (
      <MonitorPickerView
        monitorTemplates={this.props.monitorTemplates}
        onHide={this.onClickClose.bind(this)}
        onClickItem={this.onClickItem.bind(this)}
        extImageBaseUrl={extImageBaseUrl}
      />
    )
  }
}

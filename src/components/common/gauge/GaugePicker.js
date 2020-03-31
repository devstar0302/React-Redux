import React from 'react'

import GaugePickerView from './GaugePickerView'

export default class GaugePicker extends React.Component {

  onHide () {
    this.props.showGaugePicker(false)
  }

  render () {
    return (
      <GaugePickerView
        {...this.props}
        onHide={this.onHide.bind(this)}
      />
    )
  }
}

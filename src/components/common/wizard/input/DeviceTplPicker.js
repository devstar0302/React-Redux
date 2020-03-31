import React from 'react'

import DeviceTplPickerView from './DeviceTplPickerView'

export default class DeviceTplPicker extends React.Component {
  render () {
    return (
      <DeviceTplPickerView
        {...this.props}
      />
    )
  }
}

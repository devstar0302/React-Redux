import React from 'react'
import {TextField} from 'material-ui'

export default class Password extends React.Component {
  render () {
    let config = this.props.config
    let values = this.props.values

    let defaultValue = null

    if (config.name && values[config.name] !== undefined) {
      defaultValue = values[config.name]
    }

    return (
      <TextField type="password"
        className={'form-control'}
        name={config.name}
        defaultValue={defaultValue}
        validation={config.required ? 'required' : null} />
    )
  }
}

Password.defaultProps = {
  config: {},
  values: {}
}

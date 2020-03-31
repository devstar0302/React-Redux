import React from 'react'
import {util} from '../WizardUtil'
import {TextField} from 'material-ui'

export default class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let config = this.props.config
    let values = this.props.values

    let label, input
    let width = util.calcWidth(config.width)

    let placeholder = ''

    if (config.label !== null) {
      if (config.label.type === 'place') {
        placeholder = config.label.text || ''
      } else {
        label = this.props.buildLabel(config.label)
        width = util.calcWidth(config.width) - util.calcWidth(config.label.width)
      }
    }

    let defaultValue = config.value
    if (config.name && values[config.name] !== undefined) {
      defaultValue = values[config.name]
    }

    input = (
      <div className={`col-md-${width}`}
        style={util.convertStyle(config.style)}>

        <TextField className={`form-control ${config.cls || ''}`}
          name={config.name}
          defaultValue={defaultValue}
          style={util.convertStyle(config.inputStyle)}
          placeholder={placeholder}/>

      </div>
    )
    return util.wrapInputs(label, input, config['useColumn'])
  }
}

TextArea.defaultProps = {
  config: {},
  values: {},
  buildLabel: null
}

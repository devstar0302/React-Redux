import React from 'react'
import { FormCheckbox } from 'components/modal/parts'
import { Field } from 'redux-form'

export default class Checkbox extends React.Component {
  render () {
    const {config} = this.props
    return (
      <Field name={config.name} component={FormCheckbox} type="checkbox" label={config.label.text} className={config.cls}/>
    )
  }
}

Checkbox.defaultProps = {
  config: {},
  values: {},
  buildLabel: null
}

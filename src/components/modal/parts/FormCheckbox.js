import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import { checkboxStyle } from 'style/common/materialStyles'

const FormCheckbox = ({input, label, labelPosition, meta: { touched, error }, ...custom}) => (
  <Checkbox
    {...input}
    {...custom}
    label={label}
    labelPosition={labelPosition || 'right'}
    labelStyle={checkboxStyle}
    iconStyle={checkboxStyle}
    checked={!!input.value}
    onCheck={(e) => input.onChange(e)}
  />
)

export default FormCheckbox

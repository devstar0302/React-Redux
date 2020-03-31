import React from 'react'
import TextField from 'material-ui/TextField'
import { errorStyle, inputStyle, underlineStyle } from 'style/common/materialStyles'

const FormInput = ({input, label, floatingLabel, meta: { touched, error }, ...custom}) => (
  <TextField
    {...input}
    {...custom}
    hintText={label}
    floatingLabelText={floatingLabel}
    errorText={touched && error}
    errorStyle={errorStyle}
    inputStyle={inputStyle}
    underlineFocusStyle={underlineStyle}
    autoComplete="off"
  />
)

export default FormInput

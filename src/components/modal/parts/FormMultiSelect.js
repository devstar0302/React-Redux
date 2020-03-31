import React from 'react'
import {SelectField, MenuItem} from 'material-ui'
import { underlineFocusStyle, inputStyle, selectedItemStyle } from 'style/common/materialStyles'

const FormMultiSelect = ({input, label, meta: { touched, error }, value, options, onChange}) => (
  <SelectField
    {...input}
    underlineStyle={underlineFocusStyle}
    selectedMenuItemStyle={selectedItemStyle}
    menuItemStyle={inputStyle}
    multiple
    hintText={label}
    value={input.value}
    onChange={onChange || input.onChange}
  >
    {options.map(option =>
      <MenuItem
        key={option.value}
        insetChildren
        checked={input.value && input.value.includes(option.value)}
        value={option.value}
        primaryText={option.label}
      />
    )}
  </SelectField>
)

export default FormMultiSelect

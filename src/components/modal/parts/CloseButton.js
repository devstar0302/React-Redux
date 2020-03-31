import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { buttonStyle, buttonTextStyle } from 'style/common/materialStyles'

const CloseButton = ({onClose}) => (
  <div className="form-buttons">
    <RaisedButton label="Close" onClick={onClose} style={buttonStyle} labelStyle={buttonTextStyle}/>
  </div>
)

export default CloseButton

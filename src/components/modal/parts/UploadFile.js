import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { buttonStyle, buttonTextStyle } from 'style/common/materialStyles'

const UploadFile = ({onChangeFile}) => (
  <div className="pull-left upload-file">
    <RaisedButton label="Upload File" style={buttonStyle} labelStyle={buttonTextStyle}>
      <input type="file" name="file" onChange={onChangeFile}/>
    </RaisedButton>
  </div>
)

export default UploadFile

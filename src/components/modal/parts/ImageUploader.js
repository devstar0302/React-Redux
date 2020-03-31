import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { primeButtonStyle, primeButtonLabelStyle } from 'style/common/materialStyles'

const ImageUploader = ({imgUrl, onChange, className}) => (
  <div className={`image-upload-container ${className || ''}`}>
    {!imgUrl && <RaisedButton label="Choose" onClick={onChange}
      buttonStyle={primeButtonStyle} labelStyle={primeButtonLabelStyle}/>}
    <img onClick={onChange} style={{cursor: 'pointer'}} className={(imgUrl !== '') ? 'file-preview icon-black' : ''} src={imgUrl} alt=""/>
  </div>
)

export default ImageUploader

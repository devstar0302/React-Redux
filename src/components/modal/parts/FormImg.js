import React from 'react'
import Dropzone from 'react-dropzone'

const style = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  verticalAlign: 'middle'
}

const FormImg = (field) => {
  let files = field.input.value
  return (
    <div className="image-container">
      <Dropzone
        name={field.name}
        style={style}
        onDrop={(filesToUpload, e) => {
          let value = field.input.onChange(filesToUpload)
          console.log(filesToUpload)
          return value
        }}
      >
        <img src="/resources/images/modal/upload_file.png" style={{position: 'relative'}} alt=""/>
        </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="error">{field.meta.error}</span>}
      {files && (<img src={files[0].preview} alt=""/>)}
    </div>
  )
}

export default FormImg

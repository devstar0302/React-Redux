import React from 'react'

const ProfileImageUpload = ({imgSrc, onChangeImage}) => (
  <div className="row margin-md-bottom text-center">
    <div className="fileinput-button">
      <img className="img-circle profile-image" src={imgSrc} width="128" height="128" alt=""/>
      <input type="file" onChange={onChangeImage}/>
    </div>
  </div>
)

export default ProfileImageUpload

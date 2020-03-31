import React, { Component } from 'react'

import { TwoButtonsBlockCustom, UploadFile, Modal } from 'components/modal/parts'

export default class ImageUploaderModalView extends Component {
  render () {
    const {onHide, images, currentIcon, getCustomImageUrl, onClickItem,
      onChangeFile, onSave} = this.props
    return (
      <Modal title="Change Image" onRequestClose={onHide}>
        <div className="dropdown-image images-list">
          {images.map(item => (
            <div
              key={item.id}
              className={currentIcon.id === item.id ? 'active' : ''}
              onClick={onClickItem.bind(this, item)}>
              <img src={getCustomImageUrl(item)} alt=""/>
            </div>
          ))}
        </div>
        <UploadFile onChangeFile={onChangeFile}/>
        <TwoButtonsBlockCustom name2="OK" action2={onSave}/>
      </Modal>
    )
  }
}

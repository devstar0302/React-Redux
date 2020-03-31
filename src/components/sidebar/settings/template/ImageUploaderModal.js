import React, { Component } from 'react'
import { getCustomImageUrl } from 'shared/Global'
import ImageUploaderModalView from './ImageUploaderModalView'

export default class ImageUploaderModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true,
      currentIcon: props.selected || {}
    }
    this.closeModal = this.closeModal.bind(this)
    this.onClickItem = this.onClickItem.bind(this)
    this.onChangeFile = this.onChangeFile.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
  }

  componentWillMount () {
    this.props.fetchImages()
  }

  onClickSave () {
    this.closeModal(this.state.currentIcon)
  }

  closeModal (data) {
    this.props.closeTplImageModal(data)
  }

  onClickItem (item, e) {
    let currentIcon = item
    this.setState({currentIcon}, () => {
      if (this.props.closeOnSelect) {
        this.onClickSave()
      }
    })
  }

  onChangeFile (e) {
    let formData = new FormData() // eslint-disable-line no-undef
    let input = e.target
    if (!input.value) return
    let filename = input.value.split(/(\\|\/)/g).pop()
    let file = input.files[0]
    formData.append('file', file, filename)
    this.props.uploadImage(formData, (data) => {
      if (this.props.closeOnSelect) {
        this.closeModal(data)
      }
    })
  }

  render () {
    const {currentIcon} = this.state

    return (
      <ImageUploaderModalView
        show
        onHide={() => this.closeModal()}
        images={this.props.images}
        currentIcon={currentIcon}
        getCustomImageUrl={getCustomImageUrl}
        onClickItem={this.onClickItem}
        onChangeFile={this.onChangeFile}
        onSave={this.props.closeOnSelect ? null : this.onClickSave}
      />
    )
  }
}

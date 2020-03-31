import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import $ from 'jquery'
import { showAlert } from 'components/common/Alert'
import { extImageBaseUrl, roleOptions } from 'shared/Global'
import ProfileModalView from './ProfileModalView'

class ProfileModal extends Component { // eslint-disable-line react/no-multi-comp
  constructor (props) {
    super(props)
    this.state = {
    }
    this.closeModal = this.closeModal.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.onChangeImage = this.onChangeImage.bind(this)
  }

  componentWillMount () {
    this.props.fetchUserInfo()
  }

  closeModal (data) {
    this.props.closeProfileModal()
  }

  handleFormSubmit (values) {
    const {user} = this.props
    this.uploadUserImage(image => {
      const props = assign({}, user, values, {
        mapids: []
      })
      if (image) props.image = image
      console.log(props)
      this.props.updateUserProfile(props)
    })
  }

  uploadUserImage (cb) {
    let input = this.refs.file
    if (!input || !input.files || !input.files.length) return cb()
    let file = input.files[0]
    let formData = new FormData() // eslint-disable-line no-undef
    formData.append('file', file, input.value.split(/(\\|\/)/g).pop())
    $.ajax({ // eslint-disable-line no-undef
      url: '/upload',
      type: 'POST',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: (data, textStatus, jqXHR) => {
        const img = data.filename
        cb(img)
      },
      error: (jqXHR, textStatus, errorThrown) => {
        showAlert('Failed to upload.')
      }
    })
  }

  onChangeImage (e) {
    console.log('change image')
    const input = e.target
    if (input.files && input.files[0]) {
      let reader = new FileReader() // eslint-disable-line no-undef
      reader.onload = v => {
        this.props.changeProfileImg(v.target.result)
      }
      reader.readAsDataURL(input.files[0])
    }
  }
  onChangeRoles (e, index, value) {
    this.props.change('roles', value)
  }
  render () {
    const { user, handleSubmit, profileImg } = this.props
    const imgSrc = profileImg || (`${extImageBaseUrl}${user.image || 'unknown.png'}`)
    const mapOptions = this.props.maps.map(item => ({value: item.id, label: item.name}))
    const defaultChecked = (user.enabled === true)
    const checkboxLabel = 'User Enabled'
    return (
      <ProfileModalView
        show
        onHide={this.closeModal}
        imgSrc={imgSrc}
        onSubmit={handleSubmit(this.handleFormSubmit)}
        onChangeImage={this.onChangeImage}
        mapOptions={mapOptions}
        roleOptions={roleOptions}
        defaultChecked={defaultChecked}
        checkboxLabel={checkboxLabel}
        onChangeRoles={this.onChangeRoles.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.dashboard.userInfo
  })
)(reduxForm({
  form: 'userProfileForm'
})(ProfileModal))

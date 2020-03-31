import React, { Component } from 'react'
import { Field } from 'redux-form'
import { SubmitBlock, ProfileImageUpload, FormInput, FormSelect, FormMultiSelect, CheckboxItem, Modal, CardPanel } from 'components/modal/parts'

export default class ProfileModalView extends Component {
  render () {
    const {imgSrc, onHide, onSubmit, onChangeImage, mapOptions, roleOptions,
      defaultChecked, checkboxLabel, onChangeRoles} = this.props
    return (
      <Modal title="Profile" onRequestClose={onHide}>
        <form onSubmit={onSubmit}>
          <CardPanel title="Profile" className="margin-md-bottom">
            <ProfileImageUpload imgSrc={imgSrc} onChangeImage={onChangeImage} />
            <div className="form-column">
              <Field name="username" component={FormInput} label="User Name"/>
              <Field name="fullname" component={FormInput} label="Full Name"/>
              <Field name="email" component={FormInput} label="Email"/>
              <Field name="phone" component={FormInput} label="Phone"/>
              <Field name="defaultMapId" component={FormSelect} label="Default Map" options={mapOptions}/>
              <Field name="roles" type="select" component={FormMultiSelect} label="Role" options={roleOptions} props={{onChange: onChangeRoles}} />
              <CheckboxItem label={checkboxLabel} disabled defaultChecked={defaultChecked}/>
            </div>
          </CardPanel>
          <SubmitBlock name="Save"/>
        </form>
      </Modal>
    )
  }
}

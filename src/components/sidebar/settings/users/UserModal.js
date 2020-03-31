import React from 'react'
import { connect } from 'react-redux'
import { assign } from 'lodash'
import { reduxForm, change } from 'redux-form'
import axios from 'axios'
import { SimpleModalForm } from 'components/modal'
import { validate } from 'components/modal/validation/NameValidation'
import { roleOptions } from 'shared/Global'

import UserModalView from './UserModalView'

class UserModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.closeModal = this.closeModal.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.renderMapOptions = this.renderMapOptions.bind(this)
  }

  closeModal () {
    this.props.closeSettingUserModal()
  }

  handleFormSubmit (values) {
    const { editUser, selectedRoles } = this.props
    const user = assign({}, editUser, values, {
      roles: selectedRoles
    })
    if (editUser) {
      this.props.updateSettingUser(user)
    } else {
      this.props.addSettingUser(user)
    }
  }

  onClickPin () {
    axios.get('/genpin').then(response => {
      this.props.dispatch(change('userEditForm', 'pincode', response.data))
    })
  }

  onChangeRole (e, index, values) {
    this.props.selectUserRoles(values)
  }

  renderMapOptions () {
    let options = [].map(item => ({value: item.id, label: item.mapname}))
    return options
  }

  render1 () {
    const { handleSubmit } = this.props
    let header = 'User Detail'
    let buttonText = 'Save'
    let mapOptions = this.renderMapOptions()
    let roleOptions = this.renderRoleOptions()
    let content = [
      {name: 'Name', key: 'username'},
      {name: 'Full Name', key: 'fullname'},
      {type: 'password', name: 'Password'},
      {name: 'Email'},
      {name: 'Phone'},
      {name: 'Pin Code'},
      {type: 'select', name: 'Default Map', options: mapOptions},
      {type: 'select', name: 'Role', options: roleOptions}
    ]
    return (
      <SimpleModalForm
        show
        onHide={this.closeModal}
        onSubmit={handleSubmit(this.handleFormSubmit)}
        content={content}
        header={header}
        buttonText={buttonText}
      />
    )
  }
  render () {
    const { handleSubmit, maps, selectedRoles } = this.props
    const defaultmaps = maps.map(p => ({label: p.name, value: p.id}))
    return (
      <UserModalView
        onHide={this.closeModal}
        onSubmit={handleSubmit(this.handleFormSubmit)}
        defaultmaps={defaultmaps}
        roles={roleOptions}
        selectedRoles={selectedRoles}
        onChangeRole={this.onChangeRole.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.editUser,
    validate: validate
  })
)(reduxForm({form: 'userEditForm'})(UserModal))

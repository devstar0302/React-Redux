import React from 'react'
import { reduxForm } from 'redux-form'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { SimpleModalForm } from 'components/modal'

const content = [
  {name: 'Name'}
]

class CredentialTypeModal extends React.Component {
  closeModal () {
    this.props.showCredTypeModal(false)
  }

  handleFormSubmit (values) {
    const { editCredType } = this.props
    let props = assign({}, editCredType, values)
    if (editCredType) {
      this.props.updateCredType(props)
    } else {
      this.props.addCredType(props)
    }
  }

  render () {
    const { handleSubmit } = this.props
    return (
      <SimpleModalForm
        show
        onHide={this.closeModal.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        content={content}
        header="Credential Type"
        buttonText="Save"
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.settings.editCredType
  })
)(reduxForm({form: 'credTypeEditForm'})(CredentialTypeModal))

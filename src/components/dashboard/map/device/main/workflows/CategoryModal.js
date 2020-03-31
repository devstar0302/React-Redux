import React, { Component } from 'react'
import { assign } from 'lodash'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { SimpleModalForm } from 'components/modal'
import { validate } from 'components/modal/validation/NameValidation'
import {addWfCategory, closeWfCategoryModal} from 'actions'

class CategoryModal extends Component {
  handleFormSubmit (values) {
    const {editWfCategory} = this.props
    let props = assign({}, editWfCategory, values)
    if (editWfCategory) {
      // TODO
    } else {
      this.props.addWfCategory(props)
    }
  }

  onClickClose () {
    this.props.closeWfCategoryModal()
  }

  render () {
    const {handleSubmit} = this.props
    let header = 'Category'
    let content = [
      {name: 'Name'},
      {name: 'Description'}
    ]
    let buttonText = 'Save'
    return (
      <SimpleModalForm
        show
        onHide={this.onClickClose.bind(this)}
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
        content={content}
        header={header}
        buttonText={buttonText}
      />
    )
  }
}

export default connect(
  state => ({
    editWfCategory: state.devices.editWfCategory,
    initialValues: state.devices.editWfCategory,
    validate: validate
  }), {
    addWfCategory,
    closeWfCategoryModal
  }
)(reduxForm({form: 'workflowCategoryForm'})(CategoryModal))

import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'

import TagModalView from './TagModalView'

class TagModal extends React.Component {
  onSubmit (values) {
    const {editTag} = this.props
    const entity = {
      ...editTag,
      ...values
    }
    console.log(entity)
    if (editTag) {
      this.props.updateTag(entity)
    } else {
      this.props.addTag(entity)
    }
  }

  onClickClose () {
    this.props.showTagModal(false)
  }

  render () {
    const {handleSubmit} = this.props
    return (
      <TagModalView
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        onClickClose={this.onClickClose.bind(this)}
      />
    )
  }
}

export default connect(
  state => ({
    initialValues: state.tag.editTag
  })
)(reduxForm({form: 'tagForm'})(TagModal))

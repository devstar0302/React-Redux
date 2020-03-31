import React from 'react'
import { assign } from 'lodash'
import SimpleModalContainer from 'containers/modal/SimpleModalContainer'
import { validate } from 'components/modal/validation/NameValidation'

class DiagramObjectModal extends React.Component {
  onClickClose () {
    this.props.closeModal()
  }

  onClickSave (values) {
    const name = values.name
    const { objectConfig } = this.props
    if (objectConfig.name) {
      this.props.updateDiagramObject(assign({}, objectConfig, { name }))
    } else {
      this.props.addDiagramObject(assign({}, objectConfig, { name }))
    }
    this.props.closeModal()
  }

  render () {
    const {objectConfig} = this.props
    let header = 'Command'
    let inputValue = objectConfig ? objectConfig.name : ''
    let content = [
      {name: 'Name'}
    ]
    let initialValues = {
      name: inputValue
    }
    return (
      <SimpleModalContainer
        header={header}
        content={content}
        doAction={this.onClickSave.bind(this)}
        onClose={this.onClickClose.bind(this)}
        validate={validate}
        initialValues={initialValues}
      />
    )
  }
}

export default DiagramObjectModal

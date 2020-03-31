import React, { Component } from 'react'

import { Modal } from 'components/modal/parts'

export default class MainWorkflowModalView extends Component {
  render () {
    const {onSubmit, wizard, onClose} = this.props
    return (
      <Modal title="Workflow" onRequestClose={onClose}>
        <form onSubmit={onSubmit}>
          {wizard}
        </form>
      </Modal>
    )
  }
}

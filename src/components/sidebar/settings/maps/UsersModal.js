import React, { Component } from 'react'
import { SmallModalTable } from 'components/modal'

export default class UsersModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'username'
    }, {
      'displayName': 'Full Name',
      'columnName': 'fullname'
    }]
  }

  componentWillMount () {
    this.props.fetchSettingUsers()
  }

  onHide () {
    this.onClickClose()
  }

  closeModal (data) {
    this.props.onClose &&
        this.props.onClose(this, data)
  }

  onClickOK () {
    // TODO
    /* const user = this.refs.users.getSelected()
    if (!user) return showAlert('Please select user.')
    this.closeModal(user) */
  }

  onClickClose () {
    this.closeModal()
  }

  render () {
    let header = 'Users'
    let params = {}
    let data = this.props.users
    return (
      <SmallModalTable
        show={this.state.open}
        onHide={this.onClickClose.bind(this)}
        params={params}
        cells={this.cells}
        header={header}
        row={{'key': 'id'}}
        height={400}
        save
        onSave={this.onClickOK.bind(this)}
        data={data}
        useExternal={false}
      />
    )
  }

}

UsersModal.defaultProps = {
  onClose: null
}

import React, { Component } from 'react'
import { showAlert } from 'components/common/Alert'
import InfiniteTable from 'components/common/InfiniteTable'
import UsersModal from './UsersModal'
import MapUsersModalView from './MapUsersModalView'

export default class MapUsersModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      usersModalVisible: false
    }

    this.cells = [{
      'displayName': 'User Name',
      'columnName': 'username'
    }, {
      'displayName': 'Full Name',
      'columnName': 'fullname'
    }]
  }

  renderTable () {
    return (
      <InfiniteTable
        cells={this.cells}
        ref="mapusers"
        rowMetadata={{'key': 'id'}}
        bodyHeight={400}
        selectable
        useExternal={false}
        data={this.props.mapUsers}
      />
    )
  }

  renderUsersModal () {
    if (!this.state.usersModalVisible) return null
    return (
      <UsersModal {...this.props} onClose={this.onSelectUser.bind(this)}/>
    )
  }

  closeModal (data) {
    this.props.closeMapUsersModal()
  }

  onClickAdd () {
    this.setState({
      usersModalVisible: true
    })
  }

  onSelectUser (modal, user) {
    this.setState({
      usersModalVisible: false
    })
    if (!user) return
    this.props.addMapUser(this.props.editMap, user)
  }

  onClickDelete () {
    const user = this.refs.mapusers.getSelected()
    if (!user) return showAlert('Please select user')
    this.props.removeMapUser(this.props.editMap, user)
  }

  render () {
    let header = 'Map Users'
    let table = this.renderTable()
    let usersModal = this.renderUsersModal()
    return (
      <MapUsersModalView
        show
        header={header}
        table={table}
        usersModal={usersModal}
        onHide={this.closeModal.bind(this)}
        onAdd={this.onClickAdd.bind(this)}
        onDelete={this.onClickDelete.bind(this)}
      />
    )
  }
}

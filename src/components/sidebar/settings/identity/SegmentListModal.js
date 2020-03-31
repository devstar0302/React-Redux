import React, { Component } from 'react'
import { showAlert, showConfirm } from 'components/common/Alert'
import { appendComponent, removeComponent } from 'util/Component'
import SegmentModal from './SegmentModal'
import { ROOT_URL } from 'actions/config'
import SegmentListModalView from './SegmentListModalView'

export default class SegmentListModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Range',
      'columnName': 'startip',
      'customComponent': (props) => {
        const row = props.rowData
        return <span>{`${row.startip} - ${row.endip}`}</span>
      }
    }, {
      'displayName': 'Location',
      'columnName': 'location'
    }, {
      'displayName': 'Country',
      'columnName': 'country'
    }]
    this.closeModal = this.closeModal.bind(this)
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onClickAdd = this.onClickAdd.bind(this)
  }

  closeModal (data) {
    this.setState({ open: false }, () => {
      this.props.onClose && this.props.onClose(this, data)
    })
  }

  onClickAdd () {
    appendComponent(
        <SegmentModal onClose={this.onCloseModal.bind(this)}/>
    )
  }

  onClickEdit () {
    const selected = this.refs.segments.getSelected()
    if (!selected) return showAlert('Please select segment.')

    appendComponent(
      <SegmentModal onClose={this.onCloseModal.bind(this)} segment={selected}/>
    )
  }

  onCloseModal (modal, segment) {
    removeComponent(modal)
    if (!segment) return

    // this.refs.segments.refresh()
  }

  onClickDelete () {
    const selected = this.refs.segments.getSelected()
    if (!selected) return showAlert('Please select segment.')

    showConfirm('Click OK to remove.', (btn) => {
      if (btn !== 'ok') return
      $.get(`${ROOT_URL}${Api.admin.removeSegment}`, { // eslint-disable-line no-undef
        id: selected.id
      }).done((res) => {
        if (!res.success) return showAlert('Remove failed!')

        // this.refs.segments.refresh()
      }).fail(() => {
        showAlert('Remove failed!')
      })
    })
  }

  render () {
    return (
      <SegmentListModalView
        show
        onHide={this.closeModal}
        cells={this.cells}
        onAdd={this.onClickAdd}
        onEdit={this.onClickEdit}
        onDelete={this.onClickDelete}
      />
    )
  }
}

import React from 'react'

import BoardListModalView from './BoardListModalView'

import {showPrompt, showConfirm} from 'components/common/Alert'
import {showAlert} from "../../common/Alert";

export default class BoardListModal extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      selected: null
    }
  }

  getDefaultBoardId () {
    const data = [...this.props.gaugeBoards]
    data.sort((a, b) => {
      if (!a.defaultSetDate && !b.defaultSetDate) return 0
      if (!a.defaultSetDate || a.defaultSetDate > b.defaultSetDate ) return -1
      if (!b.defaultSetDate || a.defaultSetDate < b.defaultSetDate ) return 1
      return 0
    })
    if (data.length) return data[0].id
    return null
  }

  onHide () {
    this.props.showGaugeBoardsModal(false)
  }

  onClickAdd () {
    showPrompt('Please type name.', '', name => {
      if (!name) return
      this.props.addGaugeBoard({
        name
      })
    })
  }

  onClickEdit (item) {
    showPrompt('Please type name.', '', name => {
      if (!name) return
      this.props.updateGaugeBoard({
        ...item,
        name
      })
    })
  }

  onClickDelete (item) {
    showConfirm('Are you sure?', btn => {
      if (btn !== 'ok') return
      this.props.removeGaugeBoard(item)
      this.setState({selected: null})
    })
  }

  onSelect (item) {
    this.setState({selected: item})
  }

  onClickSetDefault () {
    const {selected} = this.state
    if (!selected) return showAlert('Please select dashboard.')
    this.props.setDefaultGaugeBoard(selected)
  }

  render () {
    const {gaugeBoards} = this.props
    return (
      <BoardListModalView
        defaultBoardId={this.getDefaultBoardId()}
        selected={this.state.selected}
        onHide={this.onHide.bind(this)}
        gaugeBoards={gaugeBoards}
        onSelect={this.onSelect.bind(this)}
        onClickAdd={this.onClickAdd.bind(this)}
        onClickEdit={this.onClickEdit.bind(this)}
        onClickDelete={this.onClickDelete.bind(this)}
        onClickSetDefault={this.onClickSetDefault.bind(this)}
      />
    )
  }
}

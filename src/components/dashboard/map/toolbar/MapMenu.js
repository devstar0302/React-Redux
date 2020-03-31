import React, { Component } from 'react'
import {assign} from 'lodash'
import MapSelect from '../MapSelect'
import MapSaveModal from '../MapSaveModal'
import MapImportModal from '../MapImportModal'
import MapMenuList from './MapMenuList'
import { showAlert, showPrompt, showConfirm } from 'components/common/Alert'

export default class MapMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onClickRename = this.onClickRename.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.onClickImport = this.onClickImport.bind(this)
  }

  renderMapExportModal () {
    if (!this.props.mapExportModalOpen) return
    return (
      <MapSaveModal mapId={this.props.selectedMap.id}
        onClose={() => this.props.showMapExportModal(false)}/>
    )
  }

  renderMapImportModal () {
    if (!this.props.mapImportModalVisible) return
    return (
      <MapImportModal {...this.props}/>
    )
  }

  onClickAdd () {
    showPrompt('Please input map name.', 'New Map', name => {
      if (!name) return
      this.props.addMap({name})
    })
  }

  onClickDelete () {
    const {selectedMap} = this.props
    if (!selectedMap) return showAlert('Please choose a map to delete.')

    showConfirm('Are you sure that you want to delete the map?', btn => {
      if (btn !== 'ok') return

      this.props.deleteMap(selectedMap)
    })
  }

  onClickSave () {
    if (!this.props.selectedMap) return showAlert('Please choose map.')
    this.props.showMapExportModal(true)
  }

  onClickImport () {
    this.props.openMapImportModal()
  }

  onClickRename () {
    const { selectedMap } = this.props
    if (!selectedMap) {
      showAlert('Please choose a map.')
      return
    }
    showPrompt('Please type name.', selectedMap.name, (name) => {
      if (!name) return
      this.props.updateMap(assign({}, selectedMap, {name}))
    })
  }

  render () {
    return (
      <div style={{position: 'absolute', left: '0px', top: '0px'}}>
        <MapSelect {...this.props} ref="select"/>
        <MapMenuList
          onAdd={this.onClickAdd}
          onRename={this.onClickRename}
          onDelete={this.onClickDelete}
          onSave={this.onClickSave}
          onImport={this.onClickImport}
        />
        {this.renderMapExportModal()}
        {this.renderMapImportModal()}
      </div>
    )
  }
}

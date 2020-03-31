import React from 'react'
import {RaisedButton} from 'material-ui'

import InfiniteTable from 'components/common/InfiniteTable'
import { showAlert, showConfirm } from 'components/common/Alert'

import MapModal from './MapModal'
import MapUsersModal from './MapUsersModal'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

export default class Maps extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Description',
      'columnName': 'description'
    }, {
      'displayName': 'Group',
      'columnName': 'mapgroup'
    }, {
      'displayName': 'Users',
      'columnName': 'users',
      'customComponent': p => {
        return <span>{(p.data || []).join(', ')}</span>
      }
    }]
  }

  componentWillMount () {
    this.props.fetchSettingMaps()
  }

  renderContent () {
    return (
      <InfiniteTable
        cells={this.cells}
        ref="maps"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onMapEdit.bind(this)}

        useExternal={false}
        data={this.props.maps}
      />
    )
  }

  renderMapModal () {
    if (!this.props.mapModalVisible) return
    return (
      <MapModal {...this.props}/>
    )
  }

  renderMapUsersModal () {
    if (!this.props.mapUsersModalVisible) return
    return (
      <MapUsersModal {...this.props} />
    )
  }

  getMaps () {
    return this.refs.maps
  }

  onMapAdd () {
    this.props.openSettingMapModal()
  }

  onMapEdit () {
    const selected = this.getMaps().getSelected()
    if (!selected) return showAlert('Please select map.')

    this.props.openSettingMapModal(selected)
  }

  onMapDelete () {
    const selected = this.getMaps().getSelected()
    if (!selected) return showAlert('Please select map.')

    showConfirm(`Are you sure that you want to delete map '${selected.name}'?`, (btn) => {
      if (btn !== 'ok') return

      this.props.deleteSettingMap(selected)
    })
  }

  onMapUsers () {
    const selected = this.getMaps().getSelected()
    if (!selected) return showAlert('Please select map.')

    this.props.openMapUsersModal(selected)
  }

  render () {
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div style={{position: 'absolute', right: '25px'}}>
              <RaisedButton label="Add Map" onTouchTap={this.onMapAdd.bind(this)}/>&nbsp;
              <RaisedButton label="Edit Map" onTouchTap={this.onMapEdit.bind(this)}/>&nbsp;
              <RaisedButton label="Delete Map" onTouchTap={this.onMapDelete.bind(this)}/>&nbsp;
              <RaisedButton label="Edit Map Users" onTouchTap={this.onMapUsers.bind(this)} className="hidden"/>&nbsp;
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={2} tclass="small-table" history={this.props.history} location={this.props.location} transparent>
          {this.renderContent()}
          {this.renderMapModal()}
          {this.renderMapUsersModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}

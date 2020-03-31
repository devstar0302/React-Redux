import React from 'react'
import {RaisedButton} from 'material-ui'
import moment from 'moment'

import CollectorTabs from './CollectorTabs'
import InfiniteTable from 'components/common/InfiniteTable'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import CollectorModal from './CollectorModal'
import {showAlert, showConfirm} from 'components/common/Alert'

export default class Collectors extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Version',
      'columnName': 'version'
    }, {
      'displayName': 'Type',
      'columnName': 'ostype'
    }, {
      'displayName': 'Last Seen',
      'columnName': 'lastSeen',
      'customComponent': p => {
        if (!p.data) return <span/>
        return (
          <span>{moment(p.data).fromNow()}</span>
        )
      }
    }, {
      'displayName': 'Host',
      'columnName': 'host'
    }, {
      'displayName': 'IP',
      'columnName': 'ip'
    }]
  }
  onRowDblClick () {
  }
  renderContent () {
    return (
      <InfiniteTable
        url="/collector"
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onRowDblClick.bind(this)}
        onRowClick={row => console.log(row)}
        params={{
          draw: this.props.collectorDraw
        }}
      />
    )
  }
  onClickAdd () {
    this.props.showCollectorModal(true)
  }
  onClickEdit () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose collector.')
    if (selected.name === 'Built-In') return showAlert('Built-In collector is not editable.')
    this.props.showCollectorModal(true, selected)
  }
  onClickRemove () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please choose collector.')
    if (selected.name === 'Built-In') return showAlert('Built-In collector is not editable.')
    showConfirm('Click OK to remove.', btn => {
      if (btn !== 'ok') return
      this.props.removeCollector(selected)
    })
  }
  getTable () {
    return this.refs.table
  }
  renderCollectorModal () {
    if (!this.props.collectorModalOpen) return null
    return (
      <CollectorModal {...this.props}/>
    )
  }
  render () {
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div className="pull-right">
              <RaisedButton label="Remove" onTouchTap={this.onClickRemove.bind(this)}/>&nbsp;
              <CollectorTabs history={this.props.history}/>
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={1} history={this.props.history} location={this.props.location} transparent>
          {this.renderContent()}
          {this.renderCollectorModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}

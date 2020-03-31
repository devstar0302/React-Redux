import React from 'react'
import {RaisedButton, TextField} from 'material-ui'
import { assign } from 'lodash'

import InfiniteTable from 'components/common/InfiniteTable'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import { appendComponent, removeComponent } from 'util/Component'
import { showAlert, showConfirm } from 'components/common/Alert'
import { errorStyle, inputStyle, underlineStyle } from 'style/common/materialStyles'

import IdentityModal from './IdentityModal'
import SegmentListModal from './SegmentListModal'

export default class Identities extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Description',
      'columnName': 'desc'
    }, {
      'displayName': 'IP',
      'columnName': 'ip'
    }, {
      'displayName': 'Segment',
      'columnName': 'segment'
    }, {
      'displayName': 'Country',
      'columnName': 'country'
    }]
  }

  componentWillMount () {
    this.props.fetchIdentities()
  }

  renderContent () {
    return (
      <InfiniteTable
        cells={this.cells}
        ref="identities"
        rowMetadata={{'key': 'id'}}
        selectable
        onRowDblClick={this.onEditIdentity.bind(this)}

        useExternal={false}
        data={this.props.identities.map(u => { return assign({ id: u.id }, u.identities) })}
      />
    )
  }

  renderIdentityModal () {
    if (!this.props.identityModalVisible) return null
    return (
      <IdentityModal {...this.props} />
    )
  }

  getTable () {
    return this.refs.identities
  }

  onAddIdentity () {
    this.props.openIdentityModal()
  }

  onEditIdentity () {
    let selected = this.getTable().getSelectedIndex()
    if (!selected < 0) return showAlert('Please select identity.')

    this.props.openIdentityModal(this.props.identities[selected])
  }

  onRemoveIdentity () {
    let selected = this.getTable().getSelectedIndex()
    if (!selected < 0) return showAlert('Please select identity.')

    showConfirm('Click OK to remove.', (btn) => {
      if (btn !== 'ok') return

      this.props.removeIdentity(this.props.identities[selected])
    })
  }

  onCloseIdentityModal (modal, identity) {
    removeComponent(modal)
    if (!identity) return

    this.refs.identities.reload()
  }

  onClickSegments () {
    appendComponent(
      <SegmentListModal onClose={removeComponent}/>
    )
  }

  render () {
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div className="pull-right">
              <RaisedButton label="Add" onTouchTap={this.onAddIdentity.bind(this)}/>&nbsp;
              <RaisedButton label="Edit" onTouchTap={this.onEditIdentity.bind(this)}/>&nbsp;
              <RaisedButton label="Remove" onTouchTap={this.onRemoveIdentity.bind(this)}/>&nbsp;
            </div>

            <div className="inline-block">
              <TextField
                hintText="Search"
                errorStyle={errorStyle}
                inputStyle={inputStyle}
                underlineFocusStyle={underlineStyle}
              />
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={4} history={this.props.history} location={this.props.location} transparent>
          {this.renderContent()}
          {this.renderIdentityModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}

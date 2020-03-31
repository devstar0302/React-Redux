import React from 'react'
import moment from 'moment'

import InfiniteTable from 'components/common/InfiniteTable'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

export default class Audit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }

    this.cells = [{
      'displayName': 'Time',
      'columnName': 'time',
      'customComponent': p => {
        return <span>{moment(p.data).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    }, {
      'displayName': 'IP',
      'columnName': 'ipaddress'
    }, {
      'displayName': 'User',
      'columnName': 'fullname'
    }]
  }

  renderContent () {
    return (
      <InfiniteTable
        url="/loginaudit"
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable
        params={{
          sort: 'time,desc'
        }}
      />
    )
  }
  render () {
    return (
      <TabPage>
        <TabPageHeader title="Audit">
          <div className="text-center margin-md-top">
            <div style={{position: 'absolute', right: '25px'}}/>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={6} history={this.props.history} location={this.props.location}>
          {this.renderContent()}
        </TabPageBody>
      </TabPage>
    )
  }
}

import React from 'react'
import {RaisedButton} from 'material-ui'
import axios from 'axios'

import MainTabs from '../MainTabs'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'

import { ROOT_URL } from 'actions/config'

export default class MainAdvanced extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  onClickSend () {
    axios.post(`${ROOT_URL}/restlistener/simulate`, this.refs.message.value)
  }

  render () {
    const {device} = this.props
    return (
      <TabPage>
        <TabPageHeader title={device.name}>
          <div className="text-center margin-md-top" />
        </TabPageHeader>

        <TabPageBody tabs={MainTabs(device.id)} tab={2} history={this.props.history} location={this.props.location}>
          <div className="padding-md">
            <label className="control-label col-md-12"><b>Simulate Incident</b></label>
            <label className="control-label col-md-2">Text: </label>
            <div className="col-md-10">
              <textarea className="form-control col-md-12" style={{height: '120px', resize: 'none'}} ref="message"/>
            </div>
            <div className="col-md-offset-3 col-md-9 margin-md-top">
              <RaisedButton label="send" primary onTouchTap={this.onClickSend.bind(this)} className="pull-right"/>
            </div>
          </div>
        </TabPageBody>
      </TabPage>
    )
  }
}

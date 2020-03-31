import React from 'react'
import moment from 'moment'

import { getSeverityIcon } from 'shared/Global'
import CommentsModal from 'components/common/incident/CommentsModal'
import InfiniteTable from 'components/common/InfiniteTable'
import { showPrompt } from 'components/common/Alert'

import {
  showIncidentDetail,
  showIncidentRaw
} from 'components/common/incident/Incident'

import {
  thumbup, thumpdown, done, notdone,
  rawtext, reason, openicon
} from 'style/common/materialStyles'

export default class IncidentTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      openExceptionModal: false,
      commentModalVisible: false,
      params: {},

      incident: null
    }

    this.cells = [{
      'displayName': 'Severity',
      'columnName': 'severity',
      'cssClassName': 'text-center width-80',
      'customComponent': (props) => {
        return getSeverityIcon(props.data)
      }
    }, {
      'displayName': 'Date/Time',
      'columnName': 'startTimestamp',
      'cssClassName': 'nowrap text-center width-140',
      'customComponent': (props) => {
        const {data} = props
        if (!data) return <span/>
        return (
          <span data-tip={moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')}>
            {moment(new Date(data)).fromNow()}
          </span>
        )
      }
    }, {
      'displayName': 'Description',
      'columnName': 'description',
      'customComponent': (props) => {
        let str = props.data
        if (props.rowData.lastcomment) {
          str += `<br/><b>Reason:</b> ${props.rowData.lastcomment}`
        }

        return <span dangerouslySetInnerHTML={{ __html: str }} /> // eslint-disable-line react/no-danger
      }
    }, {
      'displayName': 'Actions',
      'columnName': 'actions',
      'cssClassName': 'nowrap width-220',
      'customComponent': (p) => {
        const row = p.rowData
        return (
          <div className="table-icons-container">
            <div onClick={() => showIncidentDetail(row)}>
              {openicon}
            </div>
            &nbsp;

            <div onClick={() => { props.ackIncident(row) }}>
              {row.acknowledged ? thumbup : thumpdown}
            </div>
            &nbsp;

            <div onClick={() => this.onClickFixIncident(row)}>
              {row.fixed ? done : notdone}
            </div>
            &nbsp;

            <div onClick={showIncidentRaw.bind(null, row)}>
              {rawtext}
            </div>
            &nbsp;

            {
              (row.fixed && !row.whathappened)
                ? <div onClick={this.showIncidentComments.bind(this, row)}>
                  {reason}
                </div>
                : null
            }

          </div>
        )
      }
    }]
  }
  onRowDblClick () {

  }
  showIncidentComments (incident) {
    this.setState({
      incident,
      commentModalVisible: true
    })
  }
  onClickFixIncident (incident) {
    showPrompt('Please type comment.', '', text => {
      if (!text) return

      const {userInfo} = this.props
      const user = userInfo ? userInfo.username : 'User'

      this.props.fixIncident(incident, user, text)
    })
  }
  getParams () {
    const { severities, fixed, dateFrom, dateTo } = this.props.gauge
    const searchParams = {
      draw: this.props.incidentDraw,
      description: '""',
      severity: severities,
      afterStartTimestamp: dateFrom,
      beforeStartTimestamp: dateTo,
      deviceid: this.props.device.id,
      sort: 'startTimestamp,desc'
    }
    if (fixed) searchParams.fixed = fixed
    return searchParams
  }

  render () {
    const {incident} = this.state
    return (
      <div className="flex-1">
        <InfiniteTable
          cells={this.cells}
          ref="table"
          rowMetadata={{'key': 'id'}}
          selectable
          allowMultiSelect
          onRowDblClick={this.onRowDblClick.bind(this)}
          tableClassName="table-panel2"

          url="/incident/search/findBy"
          params={this.getParams()}
        />

        {this.state.commentModalVisible &&
        <CommentsModal
          incident={incident}
          updateDeviceIncident={this.props.updateDeviceIncident}
          onClose={() => {
            this.setState({commentModalVisible: false})
          }}/>}
      </div>
    )
  }
}

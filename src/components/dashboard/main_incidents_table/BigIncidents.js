import React, { Component } from 'react'
import moment from 'moment'
import { assign } from 'lodash'

import IncidentEventsModal from 'components/dashboard/incidents/IncidentEventsModal'
import { thumbup, thumpdown, done, notdone, rawtext, reason } from 'style/common/materialStyles'
import { getSeverityIcon, severities } from 'shared/Global'
import { showIncidentRaw, showIncidentComments } from 'components/common/incident/Incident'

import BigIncidentsView from './BigIncidentsView'

import InfiniteTable from 'components/common/InfiniteTable'

class BigIncidents extends Component {
  constructor (props) {
    super(props)
    this.cells = [{
      'displayName': 'Severity',
      'columnName': 'severity',
      'cssClassName': 'text-center width-80',
      'customComponent': (props) => {
        return <span>{getSeverityIcon(props.data)}</span>
      }
    }, {
      'displayName': 'Date/Time',
      'columnName': 'startTimestamp',
      'cssClassName': 'nowrap text-center width-180',
      'customComponent': (props) => {
        const {data} = props
        if (!data) return <span/>
        return (
          <span data-tip={moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')}>{moment(data).fromNow()}</span>
        )
      }
    }, {
      'displayName': 'System',
      'columnName': 'devicename',
      'cssClassName': 'width-180'
    }, {
      'displayName': 'Description',
      'columnName': 'description',
      'weight': 1
    }, {
      'displayName': 'Actions',
      'columnName': 'actions',
      'cssClassName': 'width-180',
      'customComponent': (p) => {
        const row = p.rowData
        // setTimeout(() => {
        //   ReactTooltip.rebuild()
        // }, 1)
        return (
          <div className = "table-icons-container">
            <div onClick={() => { this.props.ackIncident(row) }}>
              {row.acknowledged ? thumbup : thumpdown}
            </div>

            <div onClick={() => { this.props.fixIncident(row) }}>
              {row.fixed ? done : notdone}
            </div>

            <div onClick={showIncidentRaw.bind(null, row)}>
              {rawtext}
            </div>

            {
              (row.fixed && !row.whathappened)
                ? <div
                  onClick={showIncidentComments.bind(null, this.context.sid, row, this.reloadTable.bind(this))}>
                  {reason}
                </div>
                : null
            }

          </div>
        )
      }
    }]
  }

  componentWillMount () {
    this.props.updateBigIncidentParams({
      draw: 1,
      deviceid: '*',
      description: '',
      fixed: null,
      severity: ['HIGH', 'MEDIUM'],
      afterStartTimestamp: moment('2000-01-01'),
      beforeStartTimestamp: moment().endOf('year'),
      sort: 'startTimestamp,desc'
    })
  }

  reloadTable () {
    this.props.updateBigIncidentParams(assign({}, this.props.bigIncidentParams, {
      draw: this.props.bigIncidentParams.draw + 1
    }))
  }

  renderIncidentEventsModal () {
    if (!this.props.incidentEventsModalOpen) return null
    return (
      <IncidentEventsModal {...this.props}/>
    )
  }

  renderTable () {
    return (
      <InfiniteTable
        cells={this.cells}
        ref="table"
        rowMetadata={{'key': 'id'}}
        selectable

        url="/incident/search/findBy"
        params={this.props.bigIncidentParams}
      />
    )
  }

  onHide () {
    this.props.router.goBack()
  }

  onChangeSeverity (e, index, values) {
    this.props.updateBigIncidentParams(assign({}, this.props.bigIncidentParams, {
      severity: values
    }))
  }

  onChangeDateRange ({startDate, endDate}) {
    this.props.updateBigIncidentParams(assign({}, this.props.bigIncidentParams, {
      afterStartTimestamp: startDate.valueOf(),
      beforeStartTimestamp: endDate.valueOf()
    }))
  }

  onChangeFixedStatus (e, index, value) {
    this.props.updateBigIncidentParams(assign({}, this.props.bigIncidentParams, {
      fixed: value || null
    }))
  }

  onChangeKeyword (e) {
    this.props.updateBigIncidentParams(assign({}, this.props.bigIncidentParams, {
      description: e.target.value
    }))
  }

  render () {
    const { bigIncidentParams } = this.props
    if (!bigIncidentParams) return null

    return (
      <BigIncidentsView
        onHide={this.onHide.bind(this)}
        selectedSeverity={bigIncidentParams.severity}
        severityOptions={severities}
        onChangeSeverity={this.onChangeSeverity.bind(this)}

        startDate={moment(bigIncidentParams.afterStartTimestamp)}
        endDate={moment(bigIncidentParams.beforeStartTimestamp)}
        onChangeDateRange={this.onChangeDateRange.bind(this)}

        fixedStatus={bigIncidentParams.fixed}
        onChangeFixedStatus={this.onChangeFixedStatus.bind(this)}

        keyword={bigIncidentParams.description}
        onChangeKeyword={this.onChangeKeyword.bind(this)}

        table={this.renderTable()}
        eventsModal={this.renderIncidentEventsModal()}
      />
    )
  }
}

export default BigIncidents

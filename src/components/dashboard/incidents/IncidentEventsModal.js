import React from 'react'
import moment from 'moment'
import SmallModalTable from 'components/modal/SmallModalTable'

export default class IncidentEventsModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }

    this.cells = [{
      'displayName': 'Datetime',
      'columnName': 'timestamp',
      'cssClassName': 'width-200',
      'customComponent': props => {
        let data = moment(props.data).format('YYYY-MM-DD HH:mm:ss').toString()
        return <span>{data}</span>
      }
    }, {
      'displayName': 'Result',
      'columnName': 'lastResult.description',
      'customComponent': props => {
        const data = props.rowData.lastResult
        return <span>{data ? JSON.stringify(data) : ''}</span>
      }
    }]

    this.params = {
      deviceid: this.props.selectedIncident.deviceid,
      sort: 'timestamp,desc'
    }
  }

  onClickClose () {
    this.props.closeIncidentEventsModal()
  }

  render () {
    return (
      <SmallModalTable
        show={this.state.open}
        onHide={this.onClickClose.bind(this)}
        params={this.params}
        cells={this.cells}
        header="Incident Events"
        url="/event/search/findBy"
        row={{'key': 'id'}}
        height={400}
      />
    )
  }
}

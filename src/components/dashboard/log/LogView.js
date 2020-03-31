import React from 'react'
import { reduxForm, submit } from 'redux-form'
import { connect } from 'react-redux'
import { assign, debounce } from 'lodash'
import ReactTooltip from 'react-tooltip'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import { dateFormat } from 'shared/Global'

import LogSearchFormView from './LogSearchFormView'
import LogPapers from './LogPapers'
import DetailLogModal from './DetailLogModal'

import {parse} from 'query-string'

class LogView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      total: 0,
      cols: [],
      anchorEl: null
    }
    this.tooltipRebuild = debounce(ReactTooltip.rebuild, 100)
  }

  componentWillMount () {
    const {q} = parse(this.props.location.search || {})


    if (q) {
      try {
        const {logViewParam} = this.props
        const parsed = JSON.parse(q)
        const params = assign(...logViewParam, parsed)

        this.props.updateViewLogParams(params, this.props.history)
        this.props.change('query', params.query || '')
      } catch (e) {
        console.log(e)
      }
    }
  }

  onResultCountUpdate (total, data) {
    // let {cols} = this.state
    // if (data && data.length) {
    //   cols = keys(data[0].entity)
    // }
    // this.setState({
    //   total,
    //   cols
    // })
    //
    // this.tooltipRebuild()
  }
  onSearchKeyDown (e) {
    if (e.keyCode === 13) {
      submit('logViewForm')
    }
  }

  onClickDetailView (row, index, page, pageSize) {
    const params = {
      ...this.props.logViewParam,
      query: '',
      dateFrom: '',
      dateTo: '',
      dateFromEpoch: 0,
      dateToEpoch: row.entity.timestamp,
      page: 0,
      size: 100,
      rowId: row.id
    }

    // console.log(`${row.entity.timestamp} Between ${params.dateFromEpoch} - ${params.dateToEpoch}`)

    this.props.showDetailLogModal(true, params)
  }

  handleFormSubmit (values) {
    const { query } = values

    const params = assign({}, this.props.logViewParam, {
      query: query || ''
    })
    this.props.updateViewLogParams(params, this.props.history)
  }

  onChangeRange ({startDate, endDate}) {
    this.props.updateViewLogParams(assign({}, this.props.logViewParam, {
      dateFrom: startDate.format(dateFormat),
      dateTo: endDate.format(dateFormat)
    }), this.props.history)
  }

  renderDetailModal () {
    if (!this.props.detailLogModalOpen) return null
    return (
      <DetailLogModal
        {...this.props}
        revertRows
      />
    )
  }

  render () {
    const { handleSubmit, logViewParam } = this.props
    const { dateFrom, dateTo } = logViewParam

    return (
      <TabPage>
        <TabPageHeader title="Log" style={{overflowX: 'auto', overflowY: 'visible'}}>
          <LogSearchFormView
            onSearchKeyDown={this.onSearchKeyDown.bind(this)}
            onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}

            startDate={dateFrom}
            endDate={dateTo}
            onChangeDateRange={this.onChangeRange.bind(this)}
          />
        </TabPageHeader>
        <TabPageBody tabs={[]} tab={0} history={this.props.history} location={this.props.location} transparent>
          <div style={{height: '100%', position: 'relative'}}>
            <LogPapers
              url="/search/all"
              ref="table"
              rowMetadata={{'key': 'id'}}
              params={logViewParam}
              pageSize={1000}
              revertRows
              onClickView={this.onClickDetailView.bind(this)}
              onUpdateCount={this.onResultCountUpdate.bind(this)}
            />
          </div>
          {this.renderDetailModal()}
          <ReactTooltip/>
        </TabPageBody>
      </TabPage>
    )
  }
}

const LogViewForm = reduxForm({form: 'logViewForm'})(LogView)

export default connect(
  state => ({
  })
)(LogViewForm)

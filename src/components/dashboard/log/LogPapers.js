import React from 'react'
import {Paper} from 'material-ui'
import { assign, isEqual, keys, chunk, reverse, merge, isArray } from 'lodash'
import $ from 'jquery'
import moment from 'moment'
import ReactPaginate from 'react-paginate'

import { encodeUrlParams, dateFormat } from 'shared/Global'
import { ROOT_URL } from 'actions/config'
import RefreshOverlay from 'components/common/RefreshOverlay'

import {paperZDepth} from 'style/common/materialStyles'

export default class LogPapers extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPage: 0,
      isLoading: false,
      maxPages: 0,
      results: [],
      total: 0,
      hasMore: true,

      selected: []
    }
    this.lastRequest = null
  }

  getHighlighted (entity, highlights) {
    let data = merge({}, entity)
    keys(highlights).forEach(path => {
      const highlighted = highlights[path]
      const pathElements = path.split('.')

      let el = data
      pathElements.forEach((pathEl, index) => {
        if (index === pathElements.length - 1) {
          if (isArray(el[pathEl])) {
            el = el[pathEl]
            el.forEach((item, index) => {
              if (highlighted.match(item)) el[index] = highlighted
            })
          } else {
            el[pathEl] = highlighted
          }
        } else {
          el = el[pathEl]
          if (isArray(el)) el = el[0]
        }
      })
    })

    return data
  }

  componentWillMount () {
    const {onUpdateCount} = this.props
    onUpdateCount && onUpdateCount(0, [], true)
  }

  componentDidUpdate (prevProps, prevState) {
    const {url, params, handleRecord} = this.props
    if (url !== prevProps.url || !isEqual(params, prevProps.params) ||
      (prevProps.handleRecord && !handleRecord) || (!prevProps.handleRecord && handleRecord)) {
      this.refresh()
    }
  }

  componentWillUnmount () {
    if (this.lastRequest) {
      this.lastRequest.abort()
      this.lastRequest = null
    }
  }

  getCurrentData () {
    return this.props.useExternal ? this.state.results : this.props.data
  }

  getExternalData (page) {
    const {url, params, pageSize, onUpdateCount, handleRecord} = this.props
    if (!url) return
    page = page || 1
    let urlParams = assign({
      page: page - 1,
      size: pageSize || 10
    }, params)

    this.setState({
      isLoading: true
    })

    if (this.lastRequest) {
      this.lastRequest.abort()
    }

    this.lastRequest = $.get(`${ROOT_URL}${url}?${encodeUrlParams(urlParams)}`).done(res => {
      const embedded = res._embedded
      let data = embedded[keys(embedded)[0]]

      data = data.map(d => ({
        ...d,
        entity: this.getHighlighted(d.entity, d.highlights)
      }))
      if (handleRecord) {
        data = data.map(d => handleRecord(d))
      }

      if (this.props.revertRows) data = reverse(data)

      const total = res.page.totalElements
      let state = {
        results: data || [],
        currentPage: page - 1,
        maxPages: res.page.totalPages,
        total,
        isLoading: false,
        hasMore: data.length > 0
      }

      this.setState(state)
      onUpdateCount && onUpdateCount(total, state.results)
    })

    return this.lastRequest
  }

  refresh () {
    if (this.props.useExternal) {
      this.setState({
        hasMore: true
      })
      this.getExternalData(1, true)
    }
  }

  getFileName(entity) {
    return entity && entity.dataobj ? entity.dataobj.file : ''
  }
  handlePageClick (page) {
    this.getExternalData(page.selected + 1)
  }
  onClickView (row, index) {
    this.props.onClickView(row, index, this.state.currentPage, this.props.pageSize)
  }
  renderTable () {
    const {pageSize} = this.props

    const results = this.getCurrentData()

    const chunks = chunk(results, pageSize)
    return chunks.map((list, i) => {
      let title, timeFrom, timeTo
      if (list.length) {
        title = this.getFileName(list[0].entity) || this.getFileName(list[list.length - 1].entity)
        timeFrom = moment(list[0].entity.timestamp).format(dateFormat)
        timeTo = moment(list[list.length - 1].entity.timestamp).format(dateFormat)
      }
      return (
        <div key={i} className="padding-sm margin-md-bottom">
          <Paper zDepth={paperZDepth}>
            <div className="header-red">{title} : {timeFrom} ~ {timeTo}</div>
            {list.map((row, index) =>
              <div key={row.id} className="padding-xs row-hover">
                <div className="inline-block" dangerouslySetInnerHTML={{__html: row.entity && row.entity.dataobj ? row.entity.dataobj.line : ' '}}/>
                <div className="link text-primary margin-md-left" onClick={this.onClickView.bind(this, row, index)}>
                  View
                </div>
              </div>
            )}
          </Paper>
        </div>
      )
    })
  }

  renderPaging () {
    const {maxPages, currentPage} = this.state
    return (
      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel={<a>...</a>}
        breakClassName={"break-me"}
        pageCount={maxPages}
        forcePage={currentPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick.bind(this)}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}/>
    )
  }

  render () {
    const table = this.renderTable()
    return (
      <div className="flex-vertical" style={{height: '100%'}}>
        {this.renderPaging()}
        <div className="flex-1" style={{overflow: 'auto'}}>
          {table}
        </div>
        {this.state.isLoading && <RefreshOverlay />}
      </div>
    )
  }

  // render () {
  //   const table = this.renderTable()
  //   if (!this.props.bodyHeight) {
  //     return (
  //       <ReduxInfiniteScroll
  //         children={table}
  //         loadMore={this.loadMoreDeb}
  //         loadingMore={this.state.isLoading}
  //       />
  //     )
  //   }
  //   return table
  // }
}

LogPapers.defaultProps = {
  id: null,
  url: '',
  params: null,
  cells: [],
  useExternal: true,
  data: [],

  pageSize: 20,
  revertRows: false,

  onUpdateCount: null,
  handleRecord: null
}

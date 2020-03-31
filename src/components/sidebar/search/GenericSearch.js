import React from 'react'
import { reduxForm, submit, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { merge, assign, concat, isArray, keys, findIndex, debounce } from 'lodash'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import {Popover, FlatButton, Chip} from 'material-ui'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import {parse} from 'query-string'
import QueryParser from 'lucene'

import InfiniteTable from 'components/common/InfiniteTable'
import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import TabPageHeader from 'components/common/TabPageHeader'
import { guid, collections, severities, viewFilters, queryDateFormat } from 'shared/Global'
import {renderEntity} from 'components/common/CellRenderers'
import {chipStyles} from 'style/common/materialStyles'
import {getRanges, getRangeLabel} from 'components/common/DateRangePicker'
import {showAlert} from 'components/common/Alert'

import {modifyArrayValues, getArrayValues, modifyFieldValue, getFieldValue, removeField, findField, queryToString} from 'util/Query'

import SearchFormView from './SearchFormView'
import SearchSavePopover from './SearchSavePopover'
import WorkflowSelectModal from './WorkflowSelectModal'
import SavedSearchModal from './SavedSearchModal'
import RelDevicesModal from './RelDevicesModal'
import IrrelDevicesModal from './IrrelDevicesModal'
import SearchFieldsModal from './SearchFieldsModal'
import ViewFilterModal from './ViewFilterModal'

import SearchGraphModal from './SearchGraphModal'
import TagPickerModal from 'containers/settings/tag/TagPickerModalContainer'
import SearchMonitorModal from './SearchMonitorModal'

class GenericSearch extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      total: 0,
      cols: [],
      anchorEl: null
    }
    this.tooltipRebuild = debounce(ReactTooltip.rebuild, 100)
    this.cells = [{
      'displayName': ' ',
      'columnName': 'entity.id',
      'customComponent': (p) => {
        const {viewFilter} = this.props
        const {rowData} = p
        const {entity} = rowData

        if (viewFilter === viewFilters.log.name) {
          if (!entity.dataobj) return <span/>
          return (
            <div style={chipStyles.wrapper}>
              {<div className="inline-block flex-1">{entity.dataobj.line}</div>}
              {entity.dataobj.file && <Chip style={chipStyles.smallChip} labelStyle={chipStyles.smallLabel}>{entity.dataobj.file}</Chip>}
            </div>
          )
        } else if (viewFilter === viewFilters.raw.name) {
          if (!entity.rawdata) return <span/>
          return (
            <div className="padding-sm bt-gray">{entity.rawdata}</div>
          )
        } else if (viewFilter === viewFilters.notNull.name) {

        }
        if (!entity) return <span/>
        const highlighted = this.getHighlighted(entity, rowData.highlights)

        const timeField = entity.startTimestamp ? 'startTimestamp' : 'timestamp'
        delete highlighted[timeField]

        const {severity, ...others} = highlighted
        const data = {
          type: rowData.type,
          [timeField]: entity[timeField],
          severity,
          ...others
        }
        if (!severity) delete data.severity

        const {viewCols} = this.props
        if (viewCols.length > 0) {
          const remove = []
          keys(data).forEach(p => {
            if (viewCols.indexOf(p) < 0) remove.push(p)
          })
          remove.forEach(p => {
            delete data[p]
          })
        }

        const options = {
          notNull: viewFilter === viewFilters.notNull.name,
          timeField
        }
        return <div className="padding-sm bt-gray">{renderEntity(data, options)}</div>
      }
    }]
  }

  componentWillMount () {
    const {filterType} = this.props.location.state || {}
    const {q} = parse(this.props.location.search || {})
    let params = assign({}, this.props.queryParams)

    this.props.fetchDevicesGroups()
    this.props.fetchWorkflows()
    this.props.fetchMonitorTemplates()

    if (q) {
      try {
        const parsed = JSON.parse(q)
        params = assign(params, parsed, {
          draw: 1
        })
        this.props.updateSearchViewFilter('')
        this.props.resetViewCols()
        this.props.updateQueryParams(params, this.props.history)
        this.props.change('query', params.q)
      } catch (e) {}
    } else if (filterType) {
      let query = []
      if (filterType === 'today') {
        params.from = moment().startOf('day').valueOf()
        params.to = moment().endOf('day').valueOf()
      } else if (filterType === 'month') {
        params.from = moment().startOf('month').valueOf()
        params.to = moment().endOf('month').valueOf()
      } else if (filterType === 'open') {
        params.from = moment().startOf('year').valueOf()
        params.to = moment().endOf('year').valueOf()
        query.push('(fixed:false)')
      }
      query.push('(severity:HIGH OR MEDIUM)')

      const q = query.join(' AND ')
      params = assign(params, {
        q,
        types: ['incident'],
        draw: 1
      })

      this.props.updateSearchViewFilter('')
      this.props.resetViewCols()
      this.props.updateQueryParams(params, this.props.history)
      this.props.change('query', q)
    } else {
      this.props.updateSearchViewFilter(viewFilters.standard)
    }
    // this.props.fetchSearchFields(params)
  }

  formatDate (time) {
    return moment(time).fromNow()
  }

  getSearchOptions () {
    const {userInfo} = this.props
    if (!userInfo) return []
    const {searchOptions} = userInfo
    if (!searchOptions) return []
    try {
      return JSON.parse(searchOptions)
    } catch (e) {
      console.log(e)
    }
    return []
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

  getTableClass () {
    // const {viewFilter} = this.props
    // if (viewFilter === viewFilters.log.name) return 'table-no-border'
    return ''
  }

  onSearchKeyDown (e) {
    if (e.keyCode === 13) {
      submit('genericSearchForm')
    }
  }

  onRowDblClick () {

  }

  onClickSearch () {
    this.props.submit(this.props.handleSubmit(this.handleFormSubmit.bind(this)))
  }

  parse (query, suppress = false) {
    try {
      const parsed = QueryParser.parse(query)
      if (!parsed) throw new Error()
      return parsed
    } catch (e) {
      if (!suppress) showAlert('Invalid query typed.')
    }
    return null
  }

  handleFormSubmit (values) {
    const { queryParams } = this.props
    const { query } = values

    const parsed = this.parse(query)
    if (!parsed) return

    console.log(parsed)
    console.log(QueryParser.toString(parsed))

    this.props.updateQueryParams({
      ...queryParams,
      q: query,
      draw: queryParams.draw + 1
    }, this.props.history)

    // const newChips = parseSearchQuery(query)
    // const newQueryChips = concat([], queryChips, newChips)
    //
    // this.props.updateQueryChips(newQueryChips)
    //
    // const newQuery = newQueryChips.map(m => `${m.name}=${m.value}`).join(' and ')
    // const params = assign({}, this.props.params, {
    //   query: newQuery
    // })
    // this.props.updateSearchParams(params, this.props.history)
    //
    // this.props.change('query', '')
  }

  getTypeChar (type) {
    switch (type) {
      case 'long':
      case 'boolean':
      case 'int':
        return '#'
      default:
        return 'a'
    }
  }

  updateQuery (newQuery) {
    if (newQuery === null) return

    this.props.change('query', newQuery)
    this.props.updateQueryParams({
      ...this.props.queryParams,
      q: newQuery
    }, this.props.history)
  }

  handleRequestClose () {
    this.props.closeFieldsPopover()
  }

  onClickField (field, e) {
    this.props.fetchFieldTopValues(field.path, this.props.params)
    this.props.openFieldsPopover(field, e.target)
  }

  onClickValue (value) {
    const { selectedField, params, queryChips } = this.props

    if (!selectedField) return
    this.props.closeFieldsPopover()
    this.props.change('query', '')

    const newQueryChips = concat([], queryChips, {name: selectedField.path, value})
    this.props.updateQueryChips(newQueryChips)
    this.props.updateSearchParams(assign({}, params, {
      query: newQueryChips.map(m => `${m.name}=${m.value}`).join(' and ')
    }), this.props.history)
  }

  onClickChip (index) {
    const chip = this.props.queryChips[index]
    const newQueryChips = this.props.queryChips.filter((p, i) => i !== index)
    this.props.updateQueryChips(newQueryChips)

    const query = chip.name === '_all' ? chip.value : `${chip.name}=${chip.value}`
    this.props.change('query', query)
  }

  onClickRemoveChip (index) {
    const newQueryChips = this.props.queryChips.filter((p, i) => i !== index)
    this.props.updateQueryChips(newQueryChips)
    this.props.updateSearchParams(assign({}, this.props.params, {
      query: newQueryChips.map(m => `${m.name}=${m.value}`).join(' and ')
    }), this.props.history)
  }

  onClickStar (e) {
    this.props.showSavedSearch(true)
  }

  onClickSaveSearch (values) {
    const { userInfo, queryParams, viewFilter, viewCols } = this.props
    if (!userInfo) return

    const option = {
      id: guid(),
      name: values.name,
      data: JSON.stringify(queryParams),
      viewFilter,
      viewCols
    }

    if (!values.searchId) {
      if (!values.name) return
      this.props.addSearchOption(userInfo, option)
    } else {
      const options = this.getSearchOptions()
      const index = findIndex(options, {id: values.searchId})
      if (index < 0) return
      this.props.updateSearchOption(userInfo, {
        ...options[index],
        data: JSON.stringify(queryParams),
        viewFilter,
        viewCols
      })
    }
    this.props.closeSearchSavePopover()
  }

  onChangeSearchOption (selectedSearch) {
    let found
    try {
      found = JSON.parse(selectedSearch.data)
    } catch (e) {
      found = {}
    }

    this.props.updateSearchViewFilter(selectedSearch.viewFilter || '')
    this.props.resetViewCols(selectedSearch.viewCols || [])
    this.updateQuery(found.q || '(type:all)')

    this.props.closeSearchSavePopover()
  }

  onClickWorkflow () {
    this.props.openSearchWfModal()
  }

  onClickSelectWorkflow () {
    const {selectedRowWf, formValues} = this.props
    if (!selectedRowWf) return
    const {workflowNames} = this.getParams()
    if (!workflowNames.includes(selectedRowWf.name)) {
      const newQuery = modifyArrayValues(formValues.query, 'workflows', [...workflowNames, selectedRowWf.name].map(p => `"${p}"`))
      this.updateQuery(newQuery)
    }

    this.props.closeSearchWfModal()
  }

  onClickRemoveWfChip (index) {
    const wf = this.props.selectedWfs[index]
    this.props.removeSearchWf(wf)
    this.props.updateSearchParams(assign({}, this.props.params, {
      workflow: this.props.selectedWfs.filter(m => m.id !== wf.id).map(m => m.id).join(',')
    }), this.props.history)
  }

  onChangeCollection (e, index, values) {
    if (!values.length) return
    const {formValues} = this.props

    const newQuery = modifyArrayValues(formValues.query, 'type', values)
    this.updateQuery(newQuery)
  }

  onChangeMonitorType (e, index, values) {
    const {formValues} = this.props

    const newQuery = modifyArrayValues(formValues.query, 'monitortype', values)
    this.updateQuery(newQuery)
  }

  onChangeSeverity (e, index, values) {
    const {formValues} = this.props

    const newQuery = modifyArrayValues(formValues.query, 'severity', values)
    this.updateQuery(newQuery)
  }

  onChangeDateRange ({startDate, endDate}) {
    const {formValues} = this.props

    const dateLabel = getRangeLabel(getRanges(), startDate, endDate, true)

    let newQuery
    if (dateLabel.label) {
      newQuery = modifyFieldValue(formValues.query, 'from', dateLabel.label, dateLabel.label.indexOf(' ') >= 0)
      const parsed = this.parse(newQuery)
      removeField(findField(parsed, 'to'))
      newQuery = queryToString(parsed)
    } else {
      newQuery = modifyFieldValue(formValues.query, 'from', startDate.format(queryDateFormat), true)
      newQuery = modifyFieldValue(newQuery, 'to', endDate.format(queryDateFormat), true)
    }
    this.updateQuery(newQuery)
  }

  onResultCountUpdate (total, data) {
    let {cols} = this.state
    if (data && data.length) {
      cols = keys(data[0].entity)
    }
    this.setState({
      total,
      cols
    })

    this.tooltipRebuild()
  }

  onClickIllustrate () {
    this.props.showThreats(this.props.params)
    const {history} = this.props
    history.push({
      pathname: '/threatmap',
      query: {
        mode: 'replay'
      }
    })
  }
  onClickSavedSearch () {
    this.props.showSavedSearch(true)
  }
  onClickRelDevices (e) {
    this.props.showRelDevicesPopover(true, e.target)
  }
  onClickIrrelDevices () {
    this.props.showIrrelDevicesModal(true)
    this.props.fetchIrrelDevices(this.props.params)
  }
  onClickViewFilter () {
    // if (this.props.viewFilter) this.props.updateSearchViewFilter(null)
    // else this.props.updateSearchViewFilter('dataobj.line')
    this.props.showViewFilterModal(true)
  }
  onClickGraph () {
    this.props.showSearchGraphModal(true)
  }
  onClickTags (e) {
    this.setState({
      anchorEl: e.target
    })
    this.props.showSearchTagModal(true)
  }
  onPickTag (selected) {
    const {formValues} = this.props
    const {tags} = this.getParams()

    selected.forEach(tag => {
      if (!tags.includes(tag.name)) tags.push(tag.name)
    })

    const newQuery = modifyArrayValues(formValues.query, 'tags', tags)
    this.updateQuery(newQuery)

    // const {searchTags, updateSearchTags} = this.props
    // const newTags = [...searchTags]
    // tags.forEach(tag => {
    //   if (newTags.indexOf(tag.name) >= 0) return
    //   newTags.push(tag.name)
    // })
    // updateSearchTags(newTags)
  }
  onClickRemoveTagChip (index) {
    const {searchTags, updateSearchTags} = this.props
    const tags = searchTags.filter((p, i) => i !== index)
    updateSearchTags(tags)
    this.props.updateSearchParams(assign({}, this.props.params, {
      tag: tags.join(',')
    }), this.props.history)
  }
  onClickClearSearch () {
    const {updateSearchViewFilter, resetViewCols} = this.props
    updateSearchViewFilter(null)
    resetViewCols()

    const q = [
      '(type:all)',
      `(from:Ever)`
    ].join(' AND ')
    this.props.updateQueryParams({
      ...this.props.queryParams,
      draw: 1,
      q
    }, this.props.history)

    this.props.change('query', q)
  }

  onClickToggleFields () {
    const {searchFieldsVisible, collapseSearchFields} = this.props
    collapseSearchFields(!searchFieldsVisible)
  }

  onChangeMonitorId (monitor) {
    const {formValues} = this.props
    const newQuery = modifyFieldValue(formValues.query, 'monitor', monitor.name, true)
    this.updateQuery(newQuery)
    this.props.showSearchMonitorModal(false)
  }

  getMonitorId(monitorName) {
    const {allDevices} = this.props
    let uid = ''
    allDevices.forEach(p => {
      const index = findIndex(p.monitors, {name: monitorName})
      if (index >= 0) {
        uid = p.monitors[index].uid
        return false
      }
    })
    return uid
  }

  onClickSearchMonitor () {
    this.props.showSearchMonitorModal(true)
  }

  redrawSearch () {
    // this.props.refreshSearch()
  }

  renderFields () {
    const {selectedField} = this.props
    return (
      <div className="padding-sm" style={{position: 'absolute', height: '100%', minWidth: '100%'}}>
        <div className="header-blue">
          Fields
        </div>
        {this.props.fields.map(f =>
          <div key={f.path} className={`field-item margin-xs-top nowrap ${selectedField && selectedField.path === f.path ? 'selected' : ''}`}>
            <span className="margin-sm-right text-gray">{this.getTypeChar(f.type)}</span>
            <div className="link text-primary" onClick={this.onClickField.bind(this, f)}>{f.path.replace(/\.dataobj\./gi, '.').replace(/dataobj\./gi, '')}</div>
            <span className="margin-sm-left text-gray">{f.count}</span>
          </div>
        )}
      </div>
    )
  }

  renderSavePopover () {
    const { savePopoverOpen, closeSearchSavePopover } = this.props
    if (!savePopoverOpen) return
    return (
      <SearchSavePopover
        {...this.props}
        onRequestClose={closeSearchSavePopover}
        onSubmit={this.onClickSaveSearch.bind(this)}
        userOptions={this.getSearchOptions()}

        onChangeSearchOption={this.onChangeSearchOption.bind(this)}
      />
    )
  }
  renderRelDevicesPopover () {
    if (!this.props.relDevicePopoverOpen) return null
    return (
      <RelDevicesModal {...this.props}/>
    )
  }
  renderIrrelDevicesModal () {
    if (!this.props.irrelDeviceModalOpen) return null
    return (
      <IrrelDevicesModal {...this.props}/>
    )
  }
  renderFieldPopover () {
    const { selectedField, fieldPopoverOpen, anchorEl } = this.props
    if (!selectedField) return
    return (
      <Popover
        open={fieldPopoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        canAutoPosition
        style={{marginLeft: '100px'}}
        onRequestClose={this.handleRequestClose.bind(this)}
      >
        <div className="padding-md-left">
          <div className="inline-block padding-sm">
            <h4>{selectedField.path}</h4>
          </div>
          <div className="pull-right padding-sm">
            <FlatButton icon={<NavigationClose />} style={{minWidth: '44px'}} onTouchTap={this.handleRequestClose.bind(this)}/>
          </div>
        </div>

        <hr className="m-none" style={{borderColor: 'gray'}}/>

        <div className="padding-md-left padding-md-top">
          <div className="inline padding-sm">
            {selectedField.count} Values
          </div>
        </div>

        <div className="padding-md-left padding-lg-top">
          <div className="padding-sm">
            <b>Reports</b>
          </div>
          <div className="padding-sm">
            <div>
              <div className="col-md-4"><div className="link">Top values</div></div>
              <div className="col-md-4"><div className="link">Top values by time</div></div>
              <div className="col-md-4"><div className="link">Rare values</div></div>
              <div className="col-md-4"><div className="link">Events with this field</div></div>
            </div>

          </div>
        </div>

        <div style={{height: '400px', width: '100%', overflowY: 'auto', overflowX: 'hidden'}}>
          <table className="table table-hover">
            <thead>
            <tr>
              <th><b>Top 10 Values</b></th>
              <th>Count</th>
              <th>%</th>
              <th>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {
              this.props.fieldTopValues.map(m =>
                <tr key={m.name}>
                  <td>
                    <div className="link" onClick={this.onClickValue.bind(this, m.name)}>{m.name}</div>
                  </td>
                  <td>{m.count}</td>
                  <td>{(m.percent || 0).toFixed(2)}%</td>
                  <td>
                    <div style={{width: '200px'}}>
                      <img src="/resources/images/sidebar/search/bar.png" width={`${Math.max(m.percent || 0, 0.5)}%`} height="16" alt=""/>
                    </div>
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </Popover>
    )
  }

  renderWfSelectModal () {
    if (!this.props.wfModalOpen) return
    return (
      <WorkflowSelectModal {...this.props} onClickOK={this.onClickSelectWorkflow.bind(this)}/>
    )
  }

  renderSavedSearchModal () {
    if (!this.props.savedSearchModalOpen) return
    return (
      <SavedSearchModal
        {...this.props}
        onAddSearch={this.onClickSaveSearch.bind(this)}
        onChangeSearchOption={this.onChangeSearchOption.bind(this)}
        userOptions={this.getSearchOptions()}
      />
    )
  }

  renderSearchFieldsModal () {
    if (!this.props.searchFieldsModalOpen) return null
    return (
      <SearchFieldsModal {...this.props}/>
    )
  }

  renderFilterViewModal () {
    if (!this.props.viewFilterModalOpen) return null
    return (
      <ViewFilterModal
        {...this.props}
        cols={this.state.cols}
        redrawSearch={this.redrawSearch.bind(this)}
      />
    )
  }

  renderSearchGraphModal () {
    if (!this.props.searchGraphModalOpen) return null
    return (
      <SearchGraphModal {...this.props}/>
    )
  }

  renderTagsModal () {
    if (!this.props.searchTagModalOpen) return null
    return (
      <TagPickerModal
        hideAdd
        viewMode="popover"
        anchorEl={this.state.anchorEl}
        onPickMulti={this.onPickTag.bind(this)}
        onClickClose={() => this.props.showSearchTagModal(false)}/>
    )
  }

  renderSearchMonitorModal () {
    if (!this.props.searchMonitorModalOpen) return null
    return (
      <SearchMonitorModal {...this.props} onClickOK={this.onChangeMonitorId.bind(this)}/>
    )
  }

  renderFieldsView () {
    const {searchFieldsVisible} = this.props
    if (!searchFieldsVisible) return null
    return (
      <div style={{minWidth: '170px', height: '100%', overflow: 'auto', position: 'relative'}}>
        {this.renderFields()}
        {this.renderFieldPopover()}
      </div>
    )
  }

  parseDateRange (parsed) {
    const dateFromStr = getFieldValue(parsed, 'from')
    const dateToStr = getFieldValue(parsed, 'to')

    const ranges = getRanges()
    const value = ranges[dateFromStr]
    if (value) {
      return {
        from: value[0].valueOf(),
        to: value[1].valueOf()
      }
    } else {
      const from = dateFromStr ? moment(dateFromStr, queryDateFormat).valueOf() : moment().startOf('year').valueOf()
      const to = dateToStr ? moment(dateToStr, queryDateFormat).valueOf() : moment().endOf('year').valueOf()

      return {
        from, to
      }
    }


  }

  getParams () {
    const {queryParams} = this.props
    const parsed = this.parse(queryParams.q)

    const dateRange = this.parseDateRange(parsed)

    const ret = {
      severity: getArrayValues(parsed, 'severity'),
      monitorTypes: getArrayValues(parsed, 'monitortype'),
      workflowNames: getArrayValues(parsed, 'workflows'),
      tags: getArrayValues(parsed, 'tags'),
      monitorName: getFieldValue(parsed, 'monitor'),
      types: getArrayValues(parsed, 'type', collections.map(p => p.value)),
      ...dateRange
    }

    if (ret.types.length === 1 && ret.types[0].toLowerCase() === 'all') ret.types = collections.map(p => p.value)
    if (ret.severity.length === 1 && ret.severity[0].toLowerCase() === 'all') ret.severity = severities.map(p => p.value)

    return ret
  }

  getServiceParams () {
    const { queryParams, workflows } = this.props
    const { from, to, workflowNames, monitorName, types, severity } = this.getParams()
    const parsed = this.parse(queryParams.q)

    removeField(findField(parsed, 'workflows'), true)
    removeField(findField(parsed, 'monitor'))
    removeField(findField(parsed, 'to'))
    removeField(findField(parsed, 'from'))
    removeField(findField(parsed, 'severity'), true)
    removeField(findField(parsed, 'type'), true)

    const qs = []
    const q = queryToString(parsed)
    if (q) qs.push(q)

    //Workflow
    const workflowIds = []
    workflowNames.forEach(name => {
      const index = findIndex(workflows, {name})
      if (index >= 0) workflowIds.push(workflows[index].id)
    })
    if (workflowIds.length) {
      qs.push(`(workflowids:${workflowIds.join(' OR ')})`)
    }

    //Monitor
    if (monitorName) {
      const uid = this.getMonitorId(monitorName)
      if (uid) qs.push(`(monitorid:${uid})`)
    }

    //Severity
    if (severity.length)
      qs.push(`(severity:${severity.join(' OR ')})`)

    return {
      ...queryParams,
      q: qs.join(' AND '),
      from,
      to,
      types
    }
  }

  render () {
    const { handleSubmit, monitorTemplates, searchTags, queryChips, selectedWfs } = this.props
    const { severity, monitorTypes, monitorName, from, to, types } = this.getParams()

    return (
      <TabPage>
        <TabPageHeader title="" style={{overflowX: 'auto', overflowY: 'visible'}}>
          <SearchFormView
            onSearchKeyDown={this.onSearchKeyDown.bind(this)}
            onClickStar={this.onClickStar.bind(this)}
            collections={collections}
            selectedCollections={types}
            onChangeCollection={this.onChangeCollection.bind(this)}
            onClickWorkflow={this.onClickWorkflow.bind(this)}
            onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
            onClickSearch={this.onClickSearch.bind(this)}
            severities={severities}
            selectedSeverities={severity}
            onChangeSeverity={this.onChangeSeverity.bind(this)}
            startDate={from}
            endDate={to}
            onChangeDateRange={this.onChangeDateRange.bind(this)}
            onClickIllustrate={this.onClickIllustrate.bind(this)}
            onClickSavedSearch={this.onClickSavedSearch.bind(this)}
            onClickRelDevices={this.onClickRelDevices.bind(this)}
            onClickIrrelDevices={this.onClickIrrelDevices.bind(this)}

            monitorTemplates={monitorTemplates}
            selectedMonitorTypes={monitorTypes}
            onChangeMonitorType={this.onChangeMonitorType.bind(this)}

            onClickViewFilter={this.onClickViewFilter.bind(this)}
            onClickGraph={this.onClickGraph.bind(this)}

            onClickTags={this.onClickTags.bind(this)}

            onClickClear={this.onClickClearSearch.bind(this)}
            onClickToggleFields={this.onClickToggleFields.bind(this)}

            searchMonitor={monitorName || 'Any'}
            onClickSearchMonitor={this.onClickSearchMonitor.bind(this)}
          />

          <div className="text-center">
            <div className="inline">
              <div style={chipStyles.wrapper}>
                {queryChips.map((p, i) =>
                  <Chip
                    key={`${p.name}${p.value}`}
                    style={chipStyles.chip}
                    onTouchTap={this.onClickChip.bind(this, i)}
                    onRequestDelete={this.onClickRemoveChip.bind(this, i)}>
                    {p.name !== '_all' ? <b>{p.name}: </b> : null}{p.value}
                  </Chip>
                )}
                {selectedWfs.map((p, i) =>
                  <Chip
                    key={p.id}
                    style={chipStyles.chip}
                    onRequestDelete={this.onClickRemoveWfChip.bind(this, i)}>
                    <b>Workflow: </b>{p.name}
                  </Chip>
                )}
                {
                  searchTags.map((p, i) =>
                    <Chip
                      key={i}
                      style={chipStyles.chip}
                      onRequestDelete={this.onClickRemoveTagChip.bind(this, i)}>
                      <b>Tag: </b>{p}
                    </Chip>
                  )
                }
              </div>
            </div>

            {this.renderRelDevicesPopover()}
            {this.renderIrrelDevicesModal()}
            {this.renderSavePopover()}
            {this.renderWfSelectModal()}
            {this.renderSavedSearchModal()}
            {this.renderSearchFieldsModal()}
            {this.renderSearchGraphModal()}
          </div>

        </TabPageHeader>

        <TabPageBody tabs={[]} tab={0} history={this.props.history} location={this.props.location}>
          <div className="flex-horizontal" style={{height: '100%'}}>
            {this.renderFieldsView()}
            <div className="flex-1 flex-vertical padding-sm">
              <div className="header-red">
                Content
                <div className="pull-right">
                  Total: {this.state.total}
                </div>
              </div>
              <div className={`flex-1 table-no-gap ${this.getTableClass()}`}>
                <InfiniteTable
                  url="/search/query"
                  cells={this.cells}
                  ref="table"
                  rowMetadata={{'key': 'id'}}
                  selectable
                  onRowDblClick={this.onRowDblClick.bind(this)}
                  params={this.getServiceParams()}
                  pageSize={10}
                  showTableHeading={false}
                  onUpdateCount={this.onResultCountUpdate.bind(this)}
                />
              </div>
            </div>
          </div>
          {this.renderFilterViewModal()}
          {this.renderTagsModal()}
          {this.renderSearchMonitorModal()}
          <ReactTooltip/>
        </TabPageBody>
      </TabPage>
    )
  }
}

const GenericSearchForm = reduxForm({form: 'genericSearchForm'})(GenericSearch)
const selector = formValueSelector('genericSearchForm')

export default connect(
  state => ({
    initialValues: {query: state.search.queryParams.q},
    formValues: selector(state, 'query', 'searchOptionIndex')
  })
)(GenericSearchForm)

import React, { Component } from 'react'
import { ROOT_URL } from 'actions/config'

export default class MonitorLogOptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedType: 'error',
      selectedFile: '',
      keyword: '',
      heb7: false,

      files: []
    }
  }

  componentDidMount () {
    this.loadFiles()
  }

  onClickBack () {
    emit(EVENTS.DEV_MONITOR_SHOW_CLICKED) // eslint-disable-line no-undef
  }

  onChangeType (e) {
    this.setState({
      selectedType: e.target.value
    }, () => {
      this.loadFiles()
    })
  }

  onChangeFile (e) {
    this.setState({
      selectedFile: e.target.value
    }, () => {
      this.reloadTable()
    })
  }

  onChangeHeb7 (e) {
    this.setState({
      heb7: e.target.checked
    }, () => {
      this.reloadTable()
    })
  }

  onFilterChange (e) {
    this.setState({
      keyword: e.target.value
    }, () => {
      this.reloadTable()
    })
  }

  loadFiles () {
    let url = this.state.selectedType === 'all'
      ? Api.log.getFiles // eslint-disable-line no-undef
      : Api.log.getErrorFiles // eslint-disable-line no-undef

    $.get(`${ROOT_URL}${url}`, { // eslint-disable-line no-undef
      deviceid: this.props.device.id
    }).done((data) => {
      if (!data) {
        hideLoading() // eslint-disable-line no-undef
        return
      }

      let files = []
      if (this.state.selectedType === 'error') {
        files.push({
          value: '',
          name: '[All]'
        })
      }

      data.forEach(item => {
        files.push({
          value: item,
          name: item
        })
      })

      this.setState({ files, seletedFile: (files.length ? files[0].value : '') }, () => {
        this.reloadTable()
      })
    })
  }

  getFilter () {
    return {
      selectedType: this.state.selectedType,
      selectedFile: this.state.selectedFile,
      keyword: this.state.keyword,
      heb7: this.state.heb7
    }
  }

  reloadTable () {
    emit(EVENTS.DEV_MONITOR_LOG_FILTER_CHANGED, this.getFilter()) // eslint-disable-line no-undef
  }

  render () {
    return (
      <div className="text-center margin-md-top">
        <div style={{position: 'absolute'}}>
          <div className="pull-left" style={{marginTop: '9px', marginRight: '5px'}}>
            <a href="javascript:;" className="text-primary inline" onClick={this.onClickBack.bind(this)}>
              <i className="fa fa-arrow-left" /></a>
          </div>

          <div className="pull-left form-inline">
            <select
              className="form-control margin-sm-left pull-left"
              value={this.state.selectedType}
              onChange={this.onChangeType.bind(this)}
            >
              <option value="error">Error</option>
              <option value="all">All</option>
            </select>

            <select
              className="pull-left form-control"
              style={{marginLeft: '4px', maxWidth: '140px'}}
              onChange={this.onChangeFile.bind(this)}
            >
              {
                this.state.files.map(item =>
                  <option key={item.name} value={item.value}>{item.name}</option>
                )
              }
            </select>
            <label style={{marginTop: '8px', marginLeft: '4px'}}>
              <input type="checkbox" checked={this.state.heb7} onChange={this.onChangeHeb7.bind(this)}/>Translate
            </label>
          </div>
        </div>

        <div className="inline-block" style={{position: 'relative'}}>
          <input
            type="text"
            placeholder="Search"
            className="form-control"
            style={{width: '220px', paddingLeft: '35px'}}
            value={this.state.keyword}
            onChange={this.onFilterChange.bind(this)}
            ref="search"
          />
          <a className="btn" href="javascript:;" style={{position: 'absolute', left: 0, top: 0}}>
            <i className="fa fa-search" />
          </a>
        </div>
      </div>
    )
  }
}

MonitorLogOptions.defaultProps = {
  device: {},
  father: {}
}

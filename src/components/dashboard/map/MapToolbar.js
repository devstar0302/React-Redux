import React from 'react'

import { ChromePicker } from 'react-color'

import MapMenu from './MapMenu'
import DeviceMenu from './DeviceMenu'
import NewIncidentModal from './NewIncidentModal'

import { lineTypes } from 'shared/Global'

export default class Toolbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedObj: props.selectedObj || null,
      cmap: props.cmap || null,

      displayColorPicker: false,

      displayLineType: false,
      displayDevices: false,

      headerCollapsed: false
    }

    this.lineTypes = lineTypes

    this.loadLineTypes()

    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
  }

  loadLineTypes () {

  }

  renderLineTypes () {
    if (!this.state.displayLineType) return null

    const popover = {
      position: 'absolute',
      zIndex: '2',
      right: '-10px',
      top: '30px'
    }

    const cover = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }

    return (
      <div style={popover}>
        <div style={cover} onClick={this.toggleLineTypes.bind(this)}/>
        <div id="linetypediv" className="panel-group">
          <div className="panel panel-default">
            <div className="panel-body"><ul>
            {
              this.lineTypes.map(item =>
                <li key={item.typename}><a href="javascript:;" onClick={this.onClickLineType.bind(this, item)}>
                  <div className="pull-left item-icon">
                    <img src={item.image} data-type={item.type} data-typename={item.typename}/>
                  </div>
                  <div className="item-text">
                    <strong>{item.title}</strong>
                  </div>
                </a></li>
              )
            }
            </ul></div>
          </div>
        </div>
      </div>
    )
  }

    // ///////////////////////////////////////

  onClickAdd () {
    this.setState({
      displayDevices: !this.state.displayDevices
    }, () => {
      this.props.onClickAdd(this.state.displayDevices)
    })
  }

  hideDeviceMenu () {
    this.setState({
      displayDevices: false
    })
  }

    // ///////////////////////////////////////

  onClickColorPicker () {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  onCloseColorPicker () {
    this.setState({ displayColorPicker: false })
  }

  onChangeColorPicker (color) {
    this.props.onChangeLineColor(color.hex)
  }

    // ///////////////////////////////////////

  onClickMaximize () {
    this.props.onClickMaximize()
  }

  toggleLineTypes () {
    this.setState({ displayLineType: !this.state.displayLineType })
  }

  onClickLineType (item) {
    this.toggleLineTypes()

    let deviceTypeId = item['typeid']
    let type = item['typename']
    let imgUrl = item['image']

    this.props.onChangeLineType(type, imgUrl, deviceTypeId)
  }

  onClickToggleMapHeader () {
    this.setState({ headerCollapsed: !this.state.headerCollapsed })
  }

    // ///////////////////////////////////////

  renderBody () {

  }

  handleClick (e) {
        // Detect device menu outer click
    if (this.state.displayDevices) {
      if (!this.refs.liDevices.contains(e.target)) {
        this.setState({ displayDevices: false }, () => {
          this.props.onClickAdd(this.state.displayDevices)
        })
      }
    }
  }
    // ////////////////////////////////////////////////////////////////////////

  onClickNewIncident () {
    this.props.openDashboardNewIncidentModal()
  }

  renderNewIncidentModal () {
    if (!this.props.newIncidentModalOpen) return
    return (
      <NewIncidentModal onClose={this.props.closeDashboardNewIncidentModal} />
    )
  }

  render () {
    const cmap = this.props.cmap
    const obj = this.props.selectedObj

    const line = obj ? cmap.selectedLine() : null
    const lineGroup = line ? line.objectSubType === MapItemType.ShapeLineGroup : false // eslint-disable-line no-undef
    const text = obj ? cmap.selectedText() : null
    const hub = obj ? cmap.selectedLonghub() : null

    const zooming = cmap && cmap.zooming === true

    const popover = {
      position: 'absolute',
      zIndex: '2',
      left: '-40px',
      top: '30px'

    }
    const cover = {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }

    return (
      <div className={`panel-heading text-center map-heading ${this.state.headerCollapsed ? 'collapsed' : ''}`}>
        <MapMenu {...this.props}/>

        <a href="javascript:;" className="btn-new-incident" onClick={this.onClickNewIncident.bind(this)}>
          <i className="fa fa-book" title="New Incident" />
        </a>

        <div className="panel-options main-map-options" style={{top: '15px'}}>
          <ul className="nav nav-tabs" style={{background: 'transparent'}}>

            <li className="dropdown margin-sm-left">
              <a
                href="javascript:;"
                className="option maximize p-none"
                onClick={this.onClickMaximize.bind(this)}
                style={{display: this.props.maximized ? 'none' : 'block'}}
              >
                <i className="fa fa fa-arrows-alt" title="Maximize" />
                <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
              </a>
              <a
                href="javascript:;"
                className="option restore p-none"
                style={{display: this.props.maximized ? 'block' : 'none'}}
                onClick={this.onClickMaximize.bind(this)}
              >
                <i className="fa fa fa-compress" title="Restore" />
                <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
              </a>
              <ul className="dropdown-menu drop-right">
                <li>
                  <a
                    href="javascript:;"
                    className={`option ${zooming ? 'option-active' : ''}`}
                    onClick={this.props.onClickZoomRect}
                  >
                    <i className="fa fa-search margin-md-right" />Zoom Rect
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="option"
                    onClick={this.props.onClickZoomIn}
                  >
                    <i className="fa fa-search-plus margin-md-right" />Zoom In
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="option"
                    onClick={this.props.onClickZoomOut}
                  >
                    <i className="fa fa-search-minus margin-md-right" />Zoom Out
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="option"
                    onClick={this.props.onClickZoomReset}
                  >
                    <i className="fa fa fa-square-o margin-md-right" />Reset
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="javascript:"
                className="option trash p-none"
                style={{display: obj ? 'block' : 'none'}}
                onClick={this.props.onClickDelete}
              >
                <i className="fa fa-trash-o" title="Delete" />
              </a>
            </li>
            <li>
              <div
                className="input-group colorpicker-element"
                style={{display: lineGroup ? 'block' : 'none'}}
                onClick={this.onClickColorPicker.bind(this)}
              >
                <div className="input-group-addon">
                  <i className="color-preview" style={{background: lineGroup ? line.getStrokeColor() : 'black'}} />
                </div>
              </div>

              {
                this.state.displayColorPicker ? <div style={popover}>
                  <div style={cover} onClick={this.onCloseColorPicker.bind(this)}/>
                  <ChromePicker
                    color={lineGroup ? line.getStrokeColor() : 'black'}
                    onChangeComplete={this.onChangeColorPicker.bind(this)}
                  />
                </div> : null
              }

            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: lineGroup ? 'block' : 'none'}}
                onClick={this.props.onClickLineWidthInc}
              >
                <i className="fa fa-expand" title="Increase Line Width" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: lineGroup ? 'block' : 'none'}}
                onClick={this.props.onClickLineWidthDec}
              >
                <i className="fa fa-compress" title="Decrease Line Width" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: text ? 'block' : 'none'}}
                onClick={this.props.onClickFontSizeUp}
              >
                <i className="fa fa-arrow-up" title="Increase Font Size" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: text ? 'block' : 'none'}}
                onClick={this.props.onClickFontSizeDown}
              >
                <i className="fa fa-arrow-down" title="Decrease Font Size" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: text ? 'block' : 'none'}}
                onClick={this.props.onClickAlignLeft}
              >
                <i className="fa fa-align-left" title="Align Left" />
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: text ? 'block' : 'none'}}
                onClick={this.props.onClickAlignCenter}
              >
                <i className="fa fa-align-center" title="Align Center" />
              </a>

            </li>
            <li>
              <a
                href="javascript:;"
                className="option p-none"
                style={{display: text ? 'block' : 'none'}}
                onClick={this.props.onClickAlignRight}
              >
                <i className="fa fa-align-right" title="Align Right" />
              </a>
            </li>

            <li>
              <a href="javascript:;" className="option p-none" style={{display: hub ? 'block' : 'none'}}>
                <i className="fa fa-rotate-left" title="Rotate Left" />
              </a>
            </li>
            <li>
              <a href="javascript:;" className="option p-none" style={{display: hub ? 'block' : 'none'}}>
                <i className="fa fa-rotate-right" title="Rotate Right" />
              </a>
            </li>

            <li>
              <a
                href="javascript:;"
                onClick={this.toggleLineTypes.bind(this)}
                className="option p-none"
                style={{display: line ? 'block' : 'none'}}
              >
                <i className="fa fa-reply" title="Change Type" />
              </a>

              {this.renderLineTypes()}
            </li>

            <li className={this.state.displayDevices ? '' : 'dropdown'} ref="liDevices">
              <a
                href="javascript:"
                onClick={this.onClickAdd.bind(this)}
                className={`option p-none ${this.state.displayDevices ? 'option-active' : ''}`}
              >
                <i className="fa fa-plus-square" title="Add" />
                <b className="caret" style={{position: 'absolute', left: '48%', top: '23px'}} />
              </a>
              <ul className="dropdown-menu drop-right">
                <li>
                  <a href="javascript:;" onClick={this.props.onClickEdit}
                    className={`option ${this.props.editable ? 'option-active' : ''}`}
                  >
                    <i className="fa fa-edit margin-md-right" />Edit
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="option edit-undo"
                  >
                    <i className="fa fa-undo margin-md-right" />Undo
                  </a>
                </li>
              </ul>

              { this.state.displayDevices
                ? <DeviceMenu {...this.props} onClickItem={this.props.onClickDeviceItem} selectedItem={this.props.selectedItem}/>
                : null }
            </li>

            <li className="dropdown dropdown-settings">
              <a href="javascript:;" className="option p-none"><i className="fa fa-cog" title="Add" />
                <b className="caret" style ={{position: 'absolute', left: '48%', top: '23px'}} />
              </a>
              <ul className="dropdown-menu drop-right">
                <li>
                  <a href="javascript:logout();"
                    className="option"> <i className="fa fa-sign-out margin-md-right" />Log Out
                  </a>
                </li>
              </ul>
            </li>

            <li className="dropdown active">
              <a href="#" data-toggle="dropdown" className="dropdown-toggle" style={{display: 'none'}} />
              <ul className="dropdown-menu" />
            </li>
          </ul>

          {}
        </div>
        <a href="javascript:;" id="map-header-toggle" onClick={this.onClickToggleMapHeader.bind(this)}>
          <img src="/resources/images/dashboard/map/toolbar/arrow-up.png" width="14" height="14" className="up" />
          <img src="/resources/images/dashboard/map/toolbar/arrow-down.png" width="14" height="14" className="down" />
        </a>

        {this.renderNewIncidentModal()}
      </div>
    )
  }
}

Toolbar.defaultProps = {
  onClickEdit: null,
  editable: false,
  maximized: false,

  selectedItem: {},
  onClickDeviceItem: null
}

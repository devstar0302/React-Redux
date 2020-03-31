import React, { Component } from 'react'
import { MapMenu, ToolbarOptions, LineTypesMenu } from './index'
import NewIncidentModal from '../NewIncidentModal'
import { lineTypes } from 'shared/Global'

export default class Toolbar extends Component {
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

  renderLineTypes (popover, cover) {
    if (!this.state.displayLineType) return null
    return (
      <LineTypesMenu
        popover={popover}
        cover={cover}
        lineTypes={this.lineTypes}
        toogle={this.toggleLineTypes.bind(this)}
        onChoose={this.onClickLineType.bind(this)}
      />
    )
  }

    // ///////////////////////////////////////

  /* onClickAdd () {
    console.log('on click add')
    this.setState({
      displayDevices: !this.state.displayDevices
    }, () => {
      this.props.onClickAdd(this.state.displayDevices)
    })
  } */

  hideDeviceMenu () {
    this.setState({
      displayDevices: false,
      displayLineType: false
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
    let type = item['type']
    let imgUrl = item['image']
    this.props.onChangeLineType(type, imgUrl)
  }

  onClickToggleMapHeader () {
    // TODO
    // this.setState({ headerCollapsed: !this.state.headerCollapsed })
  }

  onClickMapEdit () {
    console.log('edit map')
    this.props.onClickEdit()
  }

  onClickEditMapUndo () {
    // TODO
  }

  onClickDeviceMenu (e) {
    let event = e.nativeEvent
    event.stopPropagation()
    this.toggleDevices()
  }

  toggleDevices () {
    let isDevicesDisplayed = this.state.displayDevices
    this.setState({
      displayDevices: !isDevicesDisplayed
    })
  }

  renderBody () {

  }

  onClickNewIncident () {
    this.props.openDashboardNewIncidentModal()
  }

  renderNewIncidentModal () {
    if (!this.props.newIncidentModalOpen) return
    return (
      <NewIncidentModal onClose={this.props.closeDashboardNewIncidentModal} />
    )
  }

  handleClick (e) {
    if (this.state.displayDevices) {
      let path = e.path
      let deviceMenuClicked = false
      for (let i = 0; i < path.length; i++) {
        if ((path[i].id === 'device-menu') || (path[i].id === 'device-menu-button')) {
          deviceMenuClicked = true
        }
      }
      if (!deviceMenuClicked) {
        this.toggleDevices()
      }
    }
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
    const lineTypes = this.renderLineTypes(popover, cover)

    return (
      <div className={`panel-heading map-toolbar text-center map-heading
        ${this.state.headerCollapsed ? 'collapsed' : ''}`}>
        <MapMenu {...this.props}/>
        <ToolbarOptions
          onNewIncident={this.onClickNewIncident.bind(this)}
          onMaximize={this.onClickMaximize.bind(this)}
          onColorPick={this.onClickColorPicker.bind(this)}
          onPickerClose={this.onCloseColorPicker.bind(this)}
          onPickerChange={this.onChangeColorPicker.bind(this)}
          toggleLineTypes={this.toggleLineTypes.bind(this)}
          onMapEdit={this.onClickMapEdit.bind(this)}
          onEditMapUndo={this.onClickEditMapUndo.bind(this)}
          onDeviceMenu={this.onClickDeviceMenu.bind(this)}
          onToggle={this.onClickToggleMapHeader.bind(this)}
          obj={obj}
          line={line}
          lineGroup={lineGroup}
          lineTypes={lineTypes}
          zooming={zooming}
          text={text}
          hub={hub}
          popover={popover}
          cover={cover}
          isPickerDisplayed={this.state.displayColorPicker}
          isDevicesDisplayed={this.state.displayDevices}
          {...this.props}
        />
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

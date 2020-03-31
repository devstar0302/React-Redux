import React from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'
import { assign } from 'lodash'

import MapCanvas from 'components/dashboard/map/MapCanvas'
import MapToolbar from './MapToolbar'

import DeviceWizardContainer from 'containers/shared/wizard/DeviceWizardContainer'
import GaugeWizardContainer from 'containers/shared/wizard/GaugeWizardContainer'
import { wizardConfig, getDeviceType } from 'components/common/wizard/WizardConfig'
import {showAlert, showConfirm} from 'components/common/Alert'

import DeviceDragLayer from './DeviceDragLayer'
import { isGroup } from 'shared/Global'

export default class Topology extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editable: false,
      maximized: false,

      selectedItem: {},

      dropItem: null,
      dropItemPos: {},

      tooltip: null,
      tipLeft: 0,
      tipTop: 0,
      tipWidth: 0,
      tipHeight: 0,

      tipObject: null
    }

    this.mapListener = {
      onObjectSelected: this.onMapObjectSelected.bind(this),
      onSelectionCleared: this.onMapSelectionCleared.bind(this),

      onMouseDown: this.onMapMouseDown.bind(this),
      onObjectMoving: this.onMapObjectMoving.bind(this),
      onObjectMoved: this.onMapObjectMoved.bind(this),

      onLineUpdate: this.onMapLineUpdate.bind(this),
      onLineStyleChange: this.onMapLineStyleChange.bind(this),

      onTextChanged: this.onMapTextChanged.bind(this),

      onMouseOver: this.onMapMouseOver.bind(this),
      onMouseOut: this.onMapMouseOut.bind(this),
      onZoomRect: this.onMapZoomRect.bind(this),

      onDrop: this.onDrop.bind(this)
    }

    this.mapEvents = {

      onClickAdd: this.onClickAdd.bind(this),
      onClickEdit: this.onClickEdit.bind(this),
      onClickDelete: this.onClickDelete.bind(this),

      onClickFontSizeUp: this.onClickFontSizeUp.bind(this),
      onClickFontSizeDown: this.onClickFontSizeDown.bind(this),

      onClickAlignLeft: this.onClickAlignLeft.bind(this),
      onClickAlignCenter: this.onClickAlignCenter.bind(this),
      onClickAlignRight: this.onClickAlignRight.bind(this),

      onClickLineWidthInc: this.onClickLineWidthInc.bind(this),
      onClickLineWidthDec: this.onClickLineWidthDec.bind(this),
      onChangeLineColor: this.onChangeLineColor.bind(this),
      onChangeLineType: this.onChangeLineType.bind(this),
      onClickDeviceItem: this.onClickDeviceItem.bind(this)
    }
  }

  componentWillMount () {
    this.props.fetchGroupDevicesAndLines(this.props.device.id)
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getDivMap () {
    return this.refs.map.getDecoratedComponentInstance()
  }

  getCanvasMap () {
    return this.getDivMap().getMapObject()
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onMapObjectSelected (cmap, obj) {
    this.refs.toolbar.setState({
      cmap: cmap,
      selectedObj: obj
    })
  }

  onMapSelectionCleared () {
    this.refs.toolbar.setState({
      selectedObj: null
    })
  }

  onMapMouseDown (map, obj) {
    // this.props.openDevice(obj.data)
    this.props.closeDevice()

    if (isGroup(obj.data)) {
      this.props.history.push(`/device/${obj.data.id}/dashboard`)
    } else {
      // this.props.history.push(`/device/${obj.data.id}/main`)
      this.props.history.push(`/device/${obj.data.id}/dashboard`)
    }

    ReactTooltip.hide(findDOMNode(this.refs.deviceTopTooltip))
  }

  onMapObjectMoving () {

  }

  onMapObjectMoved (map, options, type) {
    if (!options) return

    // options.mapid = this.props.device.mapid
    options.groupid = options.groupid || this.props.device.id

    return this.moveMapItem(map, options, type)
  }

  onMapLineUpdate (lineObj, callback) {
    let lineId = lineObj.id

    if (!lineId) {
      let props = {
        line: {
          from: lineObj.startObj.id,
          fromPoint: lineObj.startPoint,
          to: lineObj.endObj.id,
          toPoint: lineObj.endPoint
        },
        groupid: this.props.device.id
      }

      this.props.addGroupLine(props, (res) => {
        if (res) lineObj.id = res.id
      })
    } else {
      let con = this.findMapLine(lineId)
      if (con) {
        const props = assign({}, con, {
          line: {
            from: lineObj.startObj.id,
            fromPoint: lineObj.startPoint,
            to: lineObj.endObj.id,
            toPoint: lineObj.endPoint
          }
        })

        this.props.updateGroupLine(props)
      }
    }
  }

  findMapLine (lineId) {
    let con = this.props.mapLines.filter(u => u.id === lineId)
    if (con.length) return con[0]
    return null
  }

  onMapLineStyleChange (lineObj, style) {
    let lineId = lineObj.id
    if (!lineId) return

    const obj = this.findMapLine(lineId)
    if (!obj) return

    const props = assign({}, obj, {
      line: assign(obj.line, {
        width: style.width,
        color: style.color
      })
    })

    this.props.updateGroupLine(props)
  }

  onMapTextChanged (map, props, isLabel) {
    this.props.updateGroupDevice(props)
  }

  onMapMouseOver (map, obj) {
    if (this.state.editable) return

    let rect = obj.getBoundingRect()
    let tooltip = obj.tooltip || ''
    if (tooltip) tooltip = `<div class='text-center'>${tooltip}</div>`

    this.setState({
      tooltip: tooltip,
      tipLeft: rect.left,
      tipTop: rect.top,
      tipWidth: rect.width,
      tipHeight: rect.height,
      tipObject: obj
    }, () => {
      ReactTooltip.rebuild()
    })
  }

  onMapMouseOut () {
    if (!this.state.tooltip) return
    this.setState({
      tooltip: null
    })
  }

  onMapZoomRect () {

  }

  onDrop (item, offset) {
    let doc = document.documentElement
    let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    let cmap = this.getCanvasMap()
    let pos = cmap.canvas.getPointer({
      clientX: offset.x + left,
      clientY: offset.y + top
    })
    let {x, y} = pos

    let options = {
      title: item.title,
      type: getDeviceType(item.template.name),
      imgName: item.img,
      imageUrl: `/externalpictures?name=${item.img}`,
      x: x,
      y: y,
      width: 50,
      height: 50,

      monitors: item.template.monitors,
      templateName: item.template.name,
      dashboard: item.template.dashboard
    }

    if (options.type === 'longhub') {
      options.width = 20
      options.height = 400
    } else if (options.type === 'bi-pie') {
      options.width = 200
      options.height = 200
    } else if (options.type === 'bi-bar') {
      options.width = 200
      options.height = 200
    } else if (options.type === 'bi-line') {
      options.width = 200
      options.height = 200
    } else if (options.type === 'usertext') {
      options.width = 100
      options.height = 30
    }

    options.x -= options.width / 2
    options.y -= options.height / 2

    this.setState({
      dropItem: item,
      dropItemPos: offset
    })

    this.showAddWizard(options, (id, name, data) => {
      const refMap = this.getDivMap()
      let cmap = this.getCanvasMap()
      refMap.addMapItem(cmap, data, () => {

      })
    }, () => {
      this.setState({dropItem: null})
    })
  }

  onClickTooltip () {
    this.onMapMouseDown(null, this.state.tipObject)
    this.setState({tooltip: null})
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onClickAdd (displayMenu) {
    if (displayMenu) {
      if (!this.state.editable) this.onClickEdit()
    } else {
      if (this.state.editable) this.onClickEdit()
    }

    this.setState({
      selectedItem: {}
    })
  }

  onClickEdit () {
    let cmap = this.getCanvasMap()
    cmap.zooming && cmap.setZooming(false)

    this.setState({
      editable: !this.state.editable,
      selectedItem: {}
    })
  }

  onClickDelete () {
    let cmap = this.getCanvasMap()
    this.promptRemoveMapItem(cmap)
  }

  onClickFontSizeUp () {
    let cmap = this.getCanvasMap()
    cmap.changeFontSize(true)
  }

  onClickFontSizeDown () {
    let cmap = this.getCanvasMap()
    cmap.changeFontSize(false)
  }

  onClickAlignLeft () {
    let cmap = this.getCanvasMap()
    cmap.changeAlign('left')
  }

  onClickAlignCenter () {
    let cmap = this.getCanvasMap()
    cmap.changeAlign('center')
  }

  onClickAlignRight () {
    let cmap = this.getCanvasMap()
    cmap.changeAlign('right')
  }

  onClickLineWidthInc () {
    let cmap = this.getCanvasMap()
    cmap.changeStrokeWidth(true)
  }

  onClickLineWidthDec () {
    let cmap = this.getCanvasMap()
    cmap.changeStrokeWidth(false)
  }

  onChangeLineColor (color) {
    let cmap = this.getCanvasMap()
    cmap.changeStrokeColor(color)
  }

  onChangeLineType (type, imgUrl, deviceTypeId) {
    let cmap = this.getCanvasMap()
    const lineId = cmap.changeConnectorType(type, imgUrl)
    if (!lineId) return

    this.changeLineType(lineId, deviceTypeId)
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  moveMapItem (map, params, type) {
    if (!params) return true

    this.props.updateGroupDevice(params)
  }

  addMapUploading (map, id) {
    if (!map) return
    map.addUploading(id)
  }

  removeMapUploading (map, id) {
    if (!map) return
    map.removeUploading(id)
  }

  promptRemoveMapItem (cmap) {
    if (!cmap) return
    if (!cmap.editable) return

    let object = cmap.getSelected()
    if (!object) {
      showAlert('Please select a device to remove.') // eslint-disable-line no-undef
      return
    }

    let item = '' // eslint-disable-line no-unused-vars
    let name = '' // eslint-disable-line no-unused-vars
    let {data} = object
    let isLine = false
    if (object.objectType === MapItemType.Device) { // eslint-disable-line no-undef
      item = 'device'
      name = `Name: ${object.data.name}`
    } else if (object.objectType === MapItemType.BI) { // eslint-disable-line no-undef
      item = 'bi'
    } else if (object.objectType === MapItemType.Shape) { // eslint-disable-line no-undef
      item = 'connection'
      data = this.findMapLine(object.id)
      isLine = true
    }

    showConfirm('Click OK to delete.', (btn) => {
      if (btn !== 'ok') return

      if (data) {
        if (isLine) this.props.removeGroupLine(data)
        else this.props.removeGroupDevice(data)
      }
      cmap.removeMapItem(object, true)
    })
  }

  changeLineType (id, typeid) {

  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  renderDeviceWizard () {
    if (!this.state.deviceWizardVisible) return null

    const {options, callback, closeCallback} = this.state.deviceWizardConfig

    const extra = {
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      image: options.imgName,
      templateName: options.templateName,
      groupid: this.props.device.id
    }

    if (options.dashboard) {
      return (
        <GaugeWizardContainer
          deviceType={options.type}
          onClose={() => {
            this.setState({deviceWizardVisible: false})
            closeCallback && closeCallback()
          }}
          title={options.title}
          monitors={options.monitors}
          extraParams={extra}
          onFinish={this.onFinishAddWizard.bind(this, callback)}
        />
      )
    }

    return (
      <DeviceWizardContainer
        deviceType={options.type}
        onClose={() => {
          this.setState({deviceWizardVisible: false})
          closeCallback && closeCallback()
        }}
        title={options.title}
        monitors={options.monitors}
        extraParams={extra}
        configParams={{}}
        onFinish={this.onFinishAddWizard.bind(this, callback)}
      />
    )
  }

  showAddWizard (options, callback, closeCallback) {
    if (options.type === 'longhub') {
      const params = {
        name: 'longhub',
        angle: 0,
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        templateName: options.templateName,
        groupid: this.props.device.id
      }

      this.onClickEdit()
      this.props.addGroupDevice(params)
      closeCallback && closeCallback()
    } else {
      if (wizardConfig[options.type] === null) {
        showAlert(`Unrecognized Type: ${options.type}`) // eslint-disable-line no-undef
        return
      }

      this.setState({
        deviceWizardConfig: {
          options, callback, closeCallback
        },
        deviceWizardVisible: true
      })
    }
  }

  onFinishAddWizard (callback, res, params, url) {
    this.props.addGroupDevice(params, url)
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onClickDeviceItem (selectedItem, e) {
    this.setState({selectedItem}, () => {
    })
  }

  render () {
    let events = this.mapEvents

    const {
      tooltip, tipLeft, tipTop, tipWidth, tipHeight, selectedItem,
      dropItem, dropItemPos, editable
    } = this.state

    const { device } = this.props

    return (
      <div>
        <div className="tab-header" style={{minHeight: '40px'}}>
          <div>
            <span className="tab-title">{device.name || ''}</span>
          </div>
        </div>

        <div className="panel panel-default mb-none" id="mapeditdiv"
          style={{borderLeft: '1px solid white'}}>
          <MapToolbar
            {...this.props}
            {...events}
            {...this.state}
            ref="toolbar"
          />

          <div className="panel-body p-none"
            style={{height: this.state.maximized ? '100%' : '520px', position: 'relative'}}>
            <MapCanvas
              listener={this.mapListener}
              editable={editable}
              dragItem={selectedItem}
              dropItem={dropItem}
              dropItemPos={dropItemPos}
              mapDevices={this.props.mapDevices}
              mapLines={this.props.mapLines}
              ref="map"/>
            <DeviceDragLayer />
            <div className={`map-hover ${tooltip ? '' : 'hidden'}`}
              data-tip={tooltip}
              data-html
              style={{left: tipLeft, top: tipTop, width: tipWidth, height: tipHeight}}
              onClick={this.onClickTooltip.bind(this)} ref="deviceTopTooltip"/>
            <ReactTooltip/>
          </div>
        </div>
        {this.renderDeviceWizard()}
      </div>
    )
  }
}

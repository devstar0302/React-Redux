import React from 'react'
import { findIndex, uniqueId } from 'lodash'

import {
    DropTarget
} from 'react-dnd'

import { getDeviceType } from 'components/common/wizard/WizardConfig'
import { extImageBaseUrl, DragTypes, lineTypes } from 'shared/Global'

function collect (connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

const canvasTarget = {
  canDrop () {
    return true
  },

  drop (props, monitor) {
    props.listener.onDrop(monitor.getItem(), monitor.getClientOffset())
  }
}

class MapCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      canvas: null,
      containerId: uniqueId('container-'),
      canvasId: uniqueId('canvas-'),
      cmap: null,

      cursorPos: {
        x: -100,
        y: -100
      },

      clientCursorPos: {}
    }

    this.currentMapDevices = []
    this.currentMapLines = []

    this.updateDimensions = this.updateDimensions.bind(this)
    this.initMap = this.initMap.bind(this)
  }

  componentDidMount () {
    this.initMap(() => {
      if (this.props.mapDevices && this.props.mapDevices.length) {
        this.drawMap(this.props.mapDevices, this.props.mapLines, [], [], true)
      }
    })

    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.cmap) {
      if (nextProps.editable !== this.props.editable) {
        this.state.cmap.setEditable(nextProps.editable)
      }

      if (nextProps.showTraffic !== this.props.showTraffic) {
        this.state.cmap.setTrafficVisible(nextProps.showTraffic)
      }

      if (nextProps.dragItem.img && !this.props.dragItem.img) {
        this.setState({cursorPos: {x: -100, y: -100}})
      } else if (!nextProps.dragItem.img && this.props.dragItem.img) {
        this.setState({cursorPos: {x: -100, y: -100}})
      }

      if (nextProps.hidden !== this.props.hidden) {
        this.state.cmap.setHidden(nextProps.hidden)
      }

      const deviceUpdated = JSON.stringify(nextProps.mapDevices) !== JSON.stringify(this.currentMapDevices)
      const linesUpdated = JSON.stringify(nextProps.mapLines) !== JSON.stringify(this.currentMapLines)
      if (deviceUpdated || linesUpdated) {
        // Cancel when device adding
        if (this.state.cmap.editable) return

        let updateDeviceDataOnly = false;
        if (!linesUpdated) {
          if (this.getDevicePositionJson(nextProps.mapDevices) === this.getDevicePositionJson(this.currentMapDevices)) {
            updateDeviceDataOnly = true
          }
        }
        if (updateDeviceDataOnly) {
          console.log('Map needs to update data only.')
          this.updateMapDeviceData(nextProps.mapDevices, this.currentMapDevices)
        } else {
          console.log('Map needs to update.')
          this.drawMap(nextProps.mapDevices, nextProps.mapLines, this.currentMapDevices, this.currentMapLines, true, () => {
            console.log('Map updated.')
          })
        }

        this.currentMapDevices = nextProps.mapDevices
        this.currentMapLines = nextProps.mapLines
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions)
  }

  getDevicePositionJson (mapDevices) {
    //exclude non-position props
    return JSON.stringify(mapDevices.map(d => ({
      ...d,
      monitors: ''
    })))
  }

  updateDimensions () {
    this.respondCanvas(this.state.cmap)
  }

  initMap (cb) {
    let cmap = $.extend(true, {}, mapObject) // eslint-disable-line no-undef

    cmap.initialize({
      canvas: this.state.canvasId,
      editable: this.state.editable,
      trafficVisible: this.props.showTraffic,
      listener: this.props.listener || {}
    })
    cmap.needReset = true

    this.setState({cmap}, cb)

    this.respondCanvas(cmap)
  }

  getMapObject () {
    return this.state.cmap
  }

  getOffset () {
    return $(`#${this.state.containerId}`).offset() // eslint-disable-line no-undef
  }

  respondCanvas (cmap) {
    if (!cmap) return

    let width = $(`#${this.state.containerId}`).width() // eslint-disable-line no-undef
    let height = $(`#${this.state.containerId}`).height() // eslint-disable-line no-undef

    if (width === 0 || height === 0) return
    if (cmap.canvas.width === width && cmap.canvas.height === height) return

    cmap.canvas.setWidth(width)
    cmap.canvas.setHeight(height)
    cmap.canvas.calcOffset()

    cmap.zoomReset()
  }

  renderDrag () {
    const {cursorPos} = this.state
    const {dragItem} = this.props

    if (!dragItem || !dragItem.img) return null

    const width = 48

    return (
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
              onClick={this.onDragMouseDown.bind(this)}>
                <img
                  src={`${extImageBaseUrl}${dragItem.img}`}
                  width={width}
                  height={width}
                  alt=""
                  style={{
                    position: 'absolute',
                    left: cursorPos.x - width / 2,
                    top: cursorPos.y - width / 2,
                    cursor: `url("/resources/images/dashboard/map/cursor_drag_hand.png") 15 15, auto`
                  }}
                />
            </div>
    )
  }

  renderDropItem () {
    const {dropItem, dropItemPos} = this.props

    if (!dropItem || !dropItem.img) return null

    const width = 48
    const rt = this.containerEl.getClientRects()[0]
    if (!rt) return null

    return (
            <img src={`${extImageBaseUrl}${dropItem.img}`} width={width} height={width} alt=""
              style={{
                position: 'absolute',
                left: dropItemPos.x - rt.left - width / 2,
                top: dropItemPos.y - rt.top - width / 2
              }}
            />
    )
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  onContainerRef (el) {
    this.containerEl = el
  }

  onMouseMove (e) {
    const {dragItem} = this.props
    if (!dragItem || !dragItem.img) return false

    const rt = this.containerEl.getClientRects()[0]
    const x = e.clientX - rt.left
    const y = e.clientY - rt.top
    this.setState({
      cursorPos: {x, y},
      clientCursorPos: {
        x: e.clientX,
        y: e.clientY
      }}
        )

    return false
  }

  onClickContainer () {
    return false
  }

  onDragMouseDown (e) {
    this.props.listener.onDrop(this.props.dragItem, this.state.clientCursorPos)
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setEditable (editable) {
    let cmap = this.state.cmap
    cmap && cmap.setEditable(editable)
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  drawMap (deviceData, lineData, prevDeviceData, prevLineData, force, callback) {
    let cmap = this.state.cmap
    if (!cmap) {
      console.log('MapCanvas not initialized yet.')
      return
    }

    cmap.needReset = !!force
    cmap && cmap.zooming && cmap.setZooming(false)

    if (cmap.needReset) {
      cmap.zoomReset2(deviceData)
      cmap.canvas.renderAll()
    }
    cmap.needReset = false

    // Update Devices
    if (deviceData !== prevDeviceData) {
      this.updateMapDevices(cmap, deviceData, prevDeviceData)
    }

        // Update Lines
    if (lineData !== prevLineData) {
      this.updateMapLines(cmap, lineData, prevLineData)
    }

    setTimeout(() => {
      if (cmap.needReset) {
        cmap.zoomReset()
        cmap.needReset = false
      }

      cmap.canvas.renderAll()

      callback && callback()
    }, 500)
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  isEqualDevices (dev1, dev2) {
    let equal = JSON.stringify(dev1) === JSON.stringify(dev2)
    // $.each(dev1, (key, value) => { // eslint-disable-line no-undef
    //   if (JSON.stringify(value) !== JSON.stringify(dev2[key])) {
    //     if (key === 'monitors') {
    //       equal = 1
    //     } else {
    //       equal = 2
    //       return false
    //     }
    //   }
    // })

    return equal
  }

  isNewDevice (device) {
    let x = device.x
    let y = device.y
    return (x === -1 && y === -1) || (x === 0 && y === 0)
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateMapDeviceData (deviceData, prevDeviceData) {
    const cmap = this.state.cmap
    if (!cmap) {
      console.log('MapCanvas not initialized yet.')
      return
    }
    deviceData.forEach(device => {
      // Check for new devices
      // Find if already exists
      let index = findIndex(prevDeviceData, { id: device.id })
      let existingDevice = index >= 0 ? prevDeviceData[index] : null// findOneBy(device.id, prevDeviceData, 'id');

      if (existingDevice) {
        if (this.isNewDevice(existingDevice)) return

        // Update
        if (!this.isEqualDevices(device, existingDevice)) {
          this.updateMapItem(cmap, device)

          const mapObject = cmap.findObject(device.id)
          if (mapObject) {
            mapObject.set({
              data: device
            })
          }
        }
      }
    })
  }

  updateMapDevices (cmap, deviceData, prevDeviceData) {
    let existingDevices = []
    deviceData.forEach(device => {
            // Check for new devices
            // Find if already exists
      let index = findIndex(prevDeviceData, { id: device.id })
      let existingDevice = index >= 0 ? prevDeviceData[index] : null// findOneBy(device.id, prevDeviceData, 'id');

      if (existingDevice) {
        existingDevices.push(existingDevice)
        if (this.isNewDevice(existingDevice)) return

                // Update
        if (!this.isEqualDevices(device, existingDevice)) {
          this.updateMapItem(cmap, device)
        }
      } else if (!cmap.findObject(device.id)) {
                // Add
        this.addMapItem(cmap, device)
      }
    })

        // Remove
    prevDeviceData.forEach(device => {
      if (this.isNewDevice(device)) return
      if (existingDevices.indexOf(device) >= 0) return
      this.removeMapItem(cmap, device)
    })

    cmap.lastSX = 1
    cmap.lastSY = 1
  }

  updateMapLines (cmap, lineData, prevLineData) {
    let existingLines = []

    let connections = []
    $.each(cmap.connectors, (i, item) => { // eslint-disable-line no-undef
      connections.push(item)
    })

    lineData.forEach(item => {
      const {id, line} = item
      let existingLine = cmap.findConnector(0,
                line.from, line.fromPoint,
                line.to, line.toPoint)
      if (existingLine) {
                // Update
        existingLines.push(existingLine)
        this.updateConnection(cmap, id, line)
      } else {
                // Add
        this.drawConnection(cmap, id, line)
      }
    })

        // Remove
    $.each(connections, function (i, object) { // eslint-disable-line no-undef
      if (existingLines.indexOf(object) >= 0) return

      cmap.removeMapItem(object)
    })
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addMapItem (cmap, device, callback) {
    let deviceid = device.id
    let devicetype = getDeviceType(device.templateName)
    let devname = device.name
    let devicestatus = device.status || 'unknown'

    let x = device.x || 0
    let y = device.y || 0
    let width = device.width || 50
    let height = device.height || 50
    let textwidth = device.textWidth || 50
    let textx = device.textX || x
    let texty = device.textY || (y + height + 5)
    let textSize = device.textSize || 13
    let angle = device.angle || 0
    let textAlign = device.align || 'center'
    let propsEntity = JSON.parse(device.json || '[]') || []

    if (devicetype === 'longhub') {
      cmap.addShapeHub({
        id: deviceid,
        data: device,

        left: x,
        top: y,
        width: width,
        height: height,
        angle: angle,

        imageUrl: '/resources/images/dashboard/map/longhub.png'
      })
    } else if (devicetype === 'usertext') {
      let label = devname

      cmap.addShapeText({
        id: deviceid,
        data: device,

        left: x,
        top: y,
        width: width,
        height: height,
        fontSize: textSize,
        textAlign: textAlign,

        text: label
      })
    } else if (devicetype === 'sqlQueryGauge') {
      let percent = this.parseGaugeResult(device)
      cmap.addBiGauge({
        id: deviceid,
        data: device,

        left: x,
        top: y,
        width: width,
        height: height,

        text: percent,
        imageUrl: '/resources/images/dashboard/map/sqlgauge.png'
      })
    } else if (devicetype === 'SQLBI') {
      let charttype = ''
      $.each(propsEntity, function (i, item) { // eslint-disable-line no-undef
        if (i === 'chartType') {
          charttype = item
          return false
        }
      })

      let orgdata = null
      if (charttype) {
        try {
          let str = device.devicestatustext || ''
          str = str.replace(/'/g, '"')
          orgdata = JSON.parse(str)
        } catch (e) {

        }
      }

      if (charttype === 'pie' || charttype === 'piw') {
        let graphdata = [ {
          label: 'Internet Explorer',
          data: 25
        }, {
          label: 'Chrome',
          data: 37
        }, {
          label: 'Firefox',
          data: 21
        }, {
          label: 'Safari',
          data: 20
        } ]

        if (orgdata) {
          graphdata = []
          $.each(orgdata, function (i, item) { // eslint-disable-line no-undef
            graphdata.push({
              label: item.type,
              data: item.count
            })
          })
        }

        cmap.addBiPieChart({
          id: deviceid,

          left: x,
          top: y,
          width: width,
          height: height,

          graphdata: graphdata
        })
      } else if (charttype === 'bar') {
        const graphdata = [[0, 2], [1, 10], [2, 8]]

        cmap.addBiBarChart({
          id: deviceid,

          left: x,
          top: y,
          width: width,
          height: height,

          graphdata: graphdata
        })
      } else if (charttype === 'line') {
        const graphdata = [{
          label: 'New1',
          values: [
                        [0, 10],
                        [1, 12],
                        [2, 13],
                        [3, 14],
                        [4, 13],
                        [5, 16],
                        [6, 20],
                        [7, 22]
          ]
        }, {
          label: 'New2',
          values: [
                        [0, 6],
                        [1, 7],
                        [2, 10],
                        [3, 11],
                        [4, 9],
                        [5, 8],
                        [6, 12],
                        [7, 15]
          ]
        }]

        cmap.addBiLineChart({
          id: deviceid,

          left: x,
          top: y,
          width: width,
          height: height,

          graphdata: graphdata
        })
      }
    } else {
            // Image
      let imageUrl = ''
      let picture = device.image || ''

      if (!picture) imageUrl = '/resources/images/dashboard/map/windows.png'
      else if (picture.startsWith('/')) imageUrl = picture
      else imageUrl = extImageBaseUrl + picture
            // Status
      let okurl = this.deviceStatusImageName(devicestatus)
      let statusImageLeft = -4
      let statusImageTop = -4
            // if (devicetype === 'Firewall') {
            //     statusImageLeft = -10;
            //     statusImageTop = 2;
            // }

      // IP
      let tooltip = ''
      if (device['wanip'] || device['lanip']) {
        if (device['wanip']) tooltip = `WAN: ${device['wanip']}`
        if (device['lanip']) {
          if (tooltip) tooltip = `${tooltip}<br/>`
          tooltip = `${tooltip}LAN: ${device['lanip']}`
        }
      }

      let devconfig = {
        id: deviceid,
        data: device,
        devicetype: devicetype,
        imageLeft: x,
        imageTop: y,
        imageWidth: width,
        imageHeight: height,

        textLeft: textx,
        textTop: texty,
        textWidth: textwidth,
        textHeight: 15,
        textSize: textSize,
        textAlign: textAlign,

        tooltip: tooltip,

        text: devname,
        imageUrl: imageUrl,
        statusImageUrl: `/resources/images/dashboard/map/${okurl}`,

        statusImageLeft: statusImageLeft,
        statusImageTop: statusImageTop
      }

      if (devicetype === 'genericdevice') {
        let devicestat = JSON.parse(device.devicestatustext)
        if (devicestat === null) devicestat = '0'
        createTempGauge(devicestat.text, function (url) { // eslint-disable-line no-undef
          devconfig.imageUrl = url
          cmap.addDevice(devconfig, callback)
        })
      } else {
        cmap.addDevice(devconfig, callback)
      }
    }
  }

  updateMapItem (cmap, device) {
    let deviceid = device.id
    let devicetype = getDeviceType(device.templateName)
    let devname = device.name
    let devicestatus = device.status || 'UNKNOWN'

    let x = device.x || 0
    let y = device.y || 0
    let width = device.width || 50
    let height = device.height || 50
    let textwidth = device.textWidth || 50
    let textx = device.textX || x
    let texty = device.textY || (y + height + 5)
    let textSize = device.textSize || 13
    let angle = device.angle || 0
    let textAlign = device.align || 'center'

    let mapObject = cmap.findObject(deviceid)
    if (!mapObject) return

    /*if (equalStatus == 1) {
      mapObject.set({
        data: device
      })
      return
    }*/

    let propsEntity = JSON.parse(device.json || '[]') || []

    if (devicetype === 'longhub') {
      mapObject.update({
        left: x,
        top: y,
        width: width,
        height: height,
        angle: angle,
        data: device
      })
    } else if (devicetype === 'Text') {
      let label = devname

      mapObject.update({
        left: x,
        top: y,
        width: width,
        height: height,
        fontSize: textSize,
        textAlign: textAlign,
        text: label
      })
    } else if (devicetype === 'sqlQueryGauge') {
      let percent = this.parseGaugeResult(device)
      mapObject.update({
        data: device,

        left: x,
        top: y,
        width: width,
        height: height,

        text: percent
      })
    } else if (devicetype === 'SQLBI') {
      let charttype = ''
      $.each(propsEntity, function (i, item) { // eslint-disable-line no-undef
        if (i === 'chartType') {
          charttype = item
          return false
        }
      })
      let graphdata = []

      if (charttype === 'pie' || charttype === 'piw') {
        mapObject.update({
          left: x,
          top: y
        })
      } else if (charttype === 'bar') {
        mapObject.update({
          left: x,
          top: y,
          graphdata: graphdata
        })
      } else if (charttype === 'line') {
        mapObject.update({
          left: x,
          top: y,
          graphdata: graphdata
        })
      }
    } else {
            // Image
      let imageUrl = ''
      let picture = device.image || ''

      if (!picture) imageUrl = '/resources/images/dashboard/map/windows.png'
      else if (picture.startsWith('/')) imageUrl = picture
      else imageUrl = extImageBaseUrl + picture

            // Status
      let okurl = this.deviceStatusImageName(devicestatus)
      let statusImageLeft = -4
      let statusImageTop = -4

      // IP
      let tooltip = ''
      if (device['wanip'] || device['lanip']) {
        if (device['wanip']) tooltip = `WAN: ${device['wanip']}`
        if (device['lanip']) {
          if (tooltip) tooltip = `${tooltip}<br/>`
          tooltip = `${tooltip}LAN: ${device['lanip']}`
        }
      }

      let devconfig = {
        data: device,

        imageLeft: x,
        imageTop: y,
        imageWidth: width,
        imageHeight: height,

        textLeft: textx,
        textTop: texty,
        textWidth: textwidth,
        textHeight: 15,
        textSize: textSize,
        textAlign: textAlign,

        tooltip: tooltip,

        text: devname,
        imageUrl: imageUrl,
        statusImageUrl: `/resources/images/dashboard/map/${okurl}`,

        statusImageLeft: statusImageLeft,
        statusImageTop: statusImageTop
      }

      if (devicetype === 'genericdevice') {
        let devicestat = JSON.parse(device.devicestatustext)
        createTempGauge(devicestat ? devicestat.text : '0', function (url) { // eslint-disable-line no-undef
          devconfig.imageUrl = url

          mapObject.update(devconfig)
        })
      } else {
        mapObject.update(devconfig)
      }
    }
  }

  removeMapItem (cmap, device) {
    let deviceid = device.id
    let mapObject = cmap.findObject(deviceid)
    if (!mapObject) return

    mapObject.remove()
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  drawConnection (cmap, id, line) {
    let config = {
      id: id,
      startObj: line.from,
      startPoint: line.fromPoint,
      endObj: line.to,
      endPoint: line.toPoint,
      strokeWidth: line.width,
      strokeColor: line.color,
      lineType: line.type
    }

    if (this.isNormalLine(line.type)) {
      cmap.addShapeLine(config)
    } else {
      const typeIndex = findIndex(lineTypes, { type: line.type })
      if (typeIndex < 0) return

      config.imageUrl = lineTypes[typeIndex].image
      cmap.addShapeLightning(config)
    }
  }

  updateConnection (cmap, id, line) {
    let config = {
      id: id,
      strokeWidth: line.width,
      strokeColor: line.color,
      lineType: line.type
    }

    let object = cmap.findConnector(0, line.from, line.fromPoint,
            line.to, line.toPoint)

    if (!object) return

    if (!this.isNormalLine(line.type)) {
      const typeIndex = findIndex(lineTypes, { typename: line.type })
      if (typeIndex < 0) return

      config.imageUrl = lineTypes[typeIndex].image
    }

    if (object.lineType !== config.lineType) {
      cmap.changeConnectorType(config.lineType, config.imageUrl, object, config)
    } else {
      object.update(config)
    }
  }

    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  parseGaugeResult (device) {
    let mainprops = device
    let subprops = mainprops['devicestatustext']

    let result = (function () {
      if (subprops === null) return ''
      try {
        let statusObj = JSON.parse(subprops)
        if (!statusObj['text']) return ''
        let textObj = JSON.parse(statusObj['text'])
        if (textObj === null) return ''
        return textObj
      } catch (e) {
        console.log && console.log(e)
      }
      return ''
    })()

    return result || ''
  }

  deviceStatusImageName (status) {
    let okurl = 'status_unknown.png'
    if (status === 'UP') okurl = 'status_up.png'
    if (status === 'DOWN') okurl = 'status_down.png'

    return okurl
  }

  isNormalLine (type) {
    return !type || type === 'normal' || type === 'dashed'
  }

  render () {
    const {
      connectDropTarget
    } = this.props

    const style = {backgroundColor: '#333333', height: '100%', position: 'relative'}
    return connectDropTarget( // eslint-disable-line no-undef
      <div style={style}
        onMouseMove={this.onMouseMove.bind(this)}
        onClick={this.onClickContainer.bind(this)}
        ref={this.onContainerRef.bind(this)}>
        <div id={this.state.containerId}
          style={{backgroundColor: '#333333', height: '100%', position: 'relative'}}>

          <canvas id={this.state.canvasId} />
        </div>

        {this.renderDrag()}
        {this.renderDropItem()}
      </div>
    )
  }
}

MapCanvas.defaultProps = {
  editable: false,

  listener: {},

  dragItem: {},
  dropItem: null,
  dropItemPos: {},

  hidden: false,
  showTraffic: false,

  mapDevices: [],
  mapLines: []
}

export default DropTarget(DragTypes.DEVICE, canvasTarget, collect)(MapCanvas)

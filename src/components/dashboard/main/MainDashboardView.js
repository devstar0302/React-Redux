import React from 'react'
import {concat, assign, findIndex} from 'lodash'
import {IconButton} from 'material-ui'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import ReactTooltip from 'react-tooltip'
import {Responsive, WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import GaugeWizardContainer from 'containers/shared/wizard/GaugeWizardContainer'
import { guid, getWidgetSize, layoutCols, layoutRowHeight, layoutWidthZoom, layoutHeightZoom } from 'shared/Global'
import { wizardConfig } from 'components/common/wizard/WizardConfig'
import { gaugeEditViewStyle } from 'style/common/materialStyles'

import {showAlert} from 'components/common/Alert'

import GaugeModal from 'components/common/gauge/GaugeModal'
import GaugeMap from 'components/common/gauge/GaugeMap'
import GaugePicker from 'components/common/gauge/GaugePicker'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export default class MainDashboardView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      deviceWizardVisible: false,
      flip: {}
    }
    this.lastPlaceholder = null
  }
  componentWillMount () {
    this.props.fetchGauges()
    this.props.fetchSysSearchOptions()
    this.props.fetchWorkflows()
    this.props.fetchDevicesGroups()
    this.props.fetchMonitorGroups()
  }

  getGauges () {
    return this.props.board.gauges || []
  }

  findGauge (id) {
    const gauges = this.getGauges()
    const index = findIndex(gauges, {id})
    if (index < 0) return null
    return gauges[index]
  }

  getUserSearchOptions () {
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

  getSearchList () {
    const {sysSearchOptions} = this.props
    return concat([], this.getUserSearchOptions().map(p => {
      return assign({}, p, {
        type: 'User'
      })
    }), sysSearchOptions.map(p => {
      return assign({}, p, {
        type: 'System'
      })
    }))
  }

  getSavedSearch (id) {
    const userOptions = this.getUserSearchOptions()
    let index = findIndex(userOptions, {id})
    if (index >= 0) return userOptions[index]

    const {sysSearchOptions} = this.props
    index = findIndex(sysSearchOptions, {id})
    if (index >= 0) return sysSearchOptions[index]

    return null
  }

  onClickMenuItem (tpl) {
    console.log(tpl)

    this.props.showGaugePicker(false)

    if (['News'].indexOf(tpl.name) >= 0) {
      this.onFinishAddWizard(null, null, {
        templateName: tpl.name,
        name: tpl.name,
        resource: 'search'
      })
    } else {
      const options = {
        title: tpl.name,
        templateName: tpl.name,
        gaugeSize: 'big'
      }

      this.showAddWizard(options, (id, name, data) => {

      })
    }
  }

  showAddWizard (options, callback, closeCallback) {
    if (wizardConfig[options.type] === null) {
      showAlert(`Unrecognized Type: ${options.type}`)
      return
    }

    this.setState({
      deviceWizardConfig: {
        options, callback, closeCallback
      },
      deviceWizardVisible: true
    })
  }

  onFinishAddWizard (callback, res, params, url) {
    const {templateName} = params
    params.id = guid()

    if (templateName === 'Cpu' || templateName === 'Memory' || templateName === 'Disk') {
      if (params.gaugeType === 'accel') {
        params.layout = {
          x: 0, y: 0,
          w: 2 * layoutWidthZoom, h: 1 * layoutHeightZoom
        }
        params.gaugeSize = 'custom'
      }
    } else if(templateName === 'Incident Table') {
      params.gaugeSize = 'very big'
    }
    this.props.addGaugeItem(params, this.props.board)
  }

  getMonitors () {
    return []
  }

  gaugeAspectRatio (templateName) {
    const {gauges} = this.props
    const index = findIndex(gauges, {name: templateName})
    if (index < 0) return null
    const {aspectWidth, aspectHeight} = gauges[index]
    if (aspectWidth && aspectHeight) {
      return {w: aspectWidth, h: aspectHeight}
    }
    return null
  }

  updateLayout(layout, oldItem, newItem, isResize) {
    if (JSON.stringify(oldItem) === JSON.stringify(newItem)) return
    const gaugeItems = this.getGauges()
    const items = []
    layout.forEach((p, i) => {
      const index = findIndex(gaugeItems, {id: p.i})
      if (index < 0) return
      const gauge = {
        ...gaugeItems[index],
        layout: {
          i: p.i,
          x: p.x, y: p.y,
          w: p.w, h: p.h
        }
      }
      if (isResize) {
        if (newItem.i === gauge.id) {
          gauge.gaugeSize = 'custom'
        } else if (!gauge.minimized) {
          if (gauge.layout.y === newItem.y) gauge.layout.h = newItem.h
        }
      } else {
        if (!gauge.minimized) {
          if (gauge.layout.y === newItem.y) gauge.layout.h = newItem.h
        }
      }
      items.push(gauge)
    })
    this.props.updateGaugeItem(items, this.props.board)
  }
  onLayoutChange (layout, oldItem, newItem) {
    if (!this.lastPlaceholder) return
    newItem.x = this.lastPlaceholder.x
    newItem.y = this.lastPlaceholder.y
    this.updateLayout(layout, oldItem, newItem)
  }
  onDragStart () {
    this.lastPlaceholder = null
  }
  onDrag (layout, oldItem, newItem, placeholder, e) {
    const rowItems = layout.filter(p => p.y === placeholder.y)
    if (!rowItems.length) return
    if (findIndex(rowItems, {i: newItem.i}) < 0) rowItems.push(placeholder)
    rowItems.sort((a, b) => {
      if (a.x > b.x) return 1
      if (a.x < b.x) return -1
      return 0
    })

    let x = -1
    rowItems.forEach(p => {
      if (x < 0) {
        x = p.x
      } else {
        p.x = x
      }
      x += p.w
    })

    if (e) {
      this.lastPlaceholder = placeholder
    }
  }
  onResize (layout, oldItem, newItem, placeholder, mouseEvent, el) {
    const gauge = this.findGauge(newItem.i)
    if (!gauge) return
    if (gauge.minimized) {
      newItem.w = oldItem.w
      newItem.h = oldItem.h
      return
    }
    const ratio = this.gaugeAspectRatio(gauge.templateName)
    if (!ratio) return
    if (newItem.w !== oldItem.w) {
      const h = Math.ceil(newItem.w / layoutWidthZoom / ratio.w * ratio.h * layoutHeightZoom)
      newItem.h = h
      if (placeholder) placeholder.h = h
    } else {
      const w = Math.ceil(newItem.h / layoutHeightZoom / ratio.h * ratio.w * layoutWidthZoom)
      newItem.w = w
      if (placeholder) placeholder.w = w
    }
    layout.forEach(p => {
      if (p.i === newItem.i) {
        p.w = newItem.w
        p.h = newItem.h
      }
    })
  }
  onResizeStop (layout, oldItem, newItem, placeholder, mouseEvent, el) {
    const gauge = this.findGauge(newItem.i)
    if (!gauge) return
    if (gauge.minimized) {
      newItem.w = oldItem.w
      newItem.h = oldItem.h
      return
    }
    this.onDrag(layout, oldItem, newItem, newItem)
    this.updateLayout(layout, oldItem, newItem, true)
  }

  onClickFlip (id) {
    const {flip} = this.state
    this.setState({
      flip: {
        ...flip,
        [id]: !flip[id]
      }
    })
  }

  onClickGaugeMinimize (gauge) {
    this.props.updateGaugeItem({
      ...gauge,
      originalSize: gauge.layout,
      minimized: true
    }, this.props.board)
  }

  onClickGaugeMaximize (gauge) {
    const {layout, originalSize} = gauge
    if (layout && originalSize) {
      layout.w = originalSize.w
      layout.h = originalSize.h
    }
    this.props.updateGaugeItem({
      ...gauge,
      layout,
      minimized: false
    }, this.props.board)
  }

  onClickGaugeViewModal (gauge) {
    this.props.showGaugeModal(true, gauge)
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  renderGaugeModal () {
    if (!this.props.gaugeModalOpen) return null
    return (
      <GaugeModal
        {...this.props}
        searchList={this.getSearchList()}
        monitors={this.getMonitors()}/>
    )
  }

  renderDeviceWizard () {
    if (!this.state.deviceWizardVisible) return null

    const {options, callback, closeCallback} = this.state.deviceWizardConfig

    const extra = {
      templateName: options.templateName
    }

    return (
      <GaugeWizardContainer
        templateName={options.templateName}
        onClose={() => {
          this.setState({deviceWizardVisible: false})
          closeCallback && closeCallback()
        }}
        title={options.title}
        devices={this.props.devices || []}
        monitors={this.getMonitors()}
        extraParams={extra}
        onFinish={this.onFinishAddWizard.bind(this, callback)}
      />
    )
  }

  renderGauge (p) {
    let GaugePanel = GaugeMap[p.templateName || 'z']
    if (!GaugePanel) return <div key={p.id}/>
    const flip = this.state.flip[p.id]
    return (
      <div key={p.id} style={flip ? {zIndex: 10} : null}>
        <GaugePanel
          {...this.props}
          gauge={p}
          device={{id: p.deviceId}}
          searchList={this.getSearchList()}
          monitors={this.getMonitors()}

          flip={flip}
          onClickFlip={this.onClickFlip.bind(this, p.id)}

          updateDeviceGauge={gauge => this.props.updateGaugeItem(gauge, this.props.board)}
          removeDeviceGauge={gauge => this.props.removeGaugeItem(gauge, this.props.board)}
          onClickMinimize={this.onClickGaugeMinimize.bind(this)}
          onClickMaximize={this.onClickGaugeMaximize.bind(this)}
          onClickModalView={this.onClickGaugeViewModal.bind(this)}
          style={flip ? gaugeEditViewStyle : {width: '100%', height: '100%'}}
        />
      </div>
    )
  }

  renderAddMenu () {
    return (
      <div className="text-right" style={{position: 'absolute', top: -45, right: 0}}>
        <IconButton onTouchTap={() => this.props.showGaugePicker(true)}>
          <AddCircleIcon />
        </IconButton>
      </div>
    )
    // const {gauges} = this.props
    // return (
    //   <div className="text-right" style={{position: 'absolute', top: -45, right: 0}}>
    //     <IconMenu
    //       iconButtonElement={<IconButton><AddCircleIcon /></IconButton>}
    //       anchorOrigin={{horizontal: 'left', vertical: 'top'}}
    //       targetOrigin={{horizontal: 'left', vertical: 'top'}}
    //     >
    //       {gauges.map(p =>
    //         <MenuItem
    //           key={p.id} primaryText={p.name}
    //           leftIcon={<img src={`${extImageBaseUrl}${p.image}`} alt="" width="24" height="24" style={{background: 'black'}}/>}
    //           onTouchTap={this.onClickMenuItem.bind(this, p)}
    //         />
    //       )}
    //     </IconMenu>
    //   </div>
    // )
  }

  renderGaugePicker () {
    if (!this.props.gaugePickerOpen) return null
    return (
      <GaugePicker {...this.props} onClickMenuItem={this.onClickMenuItem.bind(this)}/>
    )
  }

  render () {
    const gauges = this.getGauges()
    const layout = mw => {
      let x = 0
      let y = 0
      return gauges.map((p, i) => {
        let {w, h, minH, minW} = getWidgetSize(p, this.props.devices, this.state.flip[p.id])
        if (p.layout) {
          if (w && h) return {...p.layout, i: p.id, w, h, minW, minH}
          return {...p.layout, i: p.id, minW, minH}
        }
        if (x + w > mw) {
          x = 0
          y++
        }
        const op = {
          i: p.id,
          x, y,
          w, h,
          minW, minH
        }

        x += w
        if (x >= mw) {
          x = 0
          y++
        }
        return op
      })
    }
    const cols = layoutCols
    const layouts = {
      lg: layout(cols['lg']),
      md: layout(cols['md']),
      sm: layout(cols['sm']),
      xs: layout(cols['xs']),
      xxs: layout(cols['xxs'])
    }
    return (
      <div>
        {this.renderAddMenu()}
        <ResponsiveReactGridLayout
          className="layout" cols={cols} rowHeight={layoutRowHeight}
          layouts={layouts}
          style={{marginTop: -10}}
          margin={[16, 16]}
          onDragStart={this.onDragStart.bind(this)}
          onDrag={this.onDrag.bind(this)}
          onDragStop={this.onLayoutChange.bind(this)}
          onResize={this.onResize.bind(this)}
          onResizeStop={this.onResizeStop.bind(this)}
        >
          {gauges.map(p => this.renderGauge(p))}
        </ResponsiveReactGridLayout>


        {this.renderGaugePicker()}
        {this.renderDeviceWizard()}
        {this.renderGaugeModal()}
        <ReactTooltip />
      </div>
    )
  }
}

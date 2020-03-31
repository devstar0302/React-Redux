import React from 'react'
// import { ChromePicker } from 'react-color'
import {IconButton} from 'material-ui'
import CreateIcon from 'material-ui/svg-icons/content/create'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

import DeviceMenu from './DeviceMenu'
import { lineTypes } from 'shared/Global'

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

const buttonStyle = {
  padding: 0,
  width: 32,
  height: 32
}

const iconStyle = {
  width: 24,
  height: 24
}

export default class Toolbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedObj: null,
      cmap: null,

      displayColorPicker: false,

      displayLineType: false,
      displayDevices: false
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

  handleClick (e) {
    // Detect device menu outer click
    if (this.state.displayDevices) {

      let path = e.path
      let deviceMenuClicked = false
      for (let i = 0; i < path.length; i++) {
        if (path[i].id === 'device-menu' || path[i].id === 'device-menu-button') {
          deviceMenuClicked = true
        }
      }
      if (!deviceMenuClicked) {
        this.setState({ displayDevices: false }, () => {
          this.props.onClickAdd(this.state.displayDevices)
        })
      }
    }
  }

  renderLineTypes () {
    if (!this.state.displayLineType) return null

    return (
      <div style={popover}>
        <div style={cover} onClick={this.toggleLineTypes.bind(this)}/>
        <div id="linetypediv" className="panel-group">
          <div className="panel panel-default">
            <div className="panel-body">
              <ul>
              {
                this.lineTypes.map(item =>
                  <li key={item.typename}>
                    <div className="link" onClick={this.onClickLineType.bind(this, item)}>
                      <div className="pull-left item-icon">
                        <img src={item.image} data-type={item.type} data-typename={item.typename} alt=""/>
                      </div>
                      <div className="item-text">
                        <strong>{item.title}</strong>
                      </div>
                    </div>
                  </li>
                )
              }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

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

  onClickColorPicker () {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  onCloseColorPicker () {
    this.setState({ displayColorPicker: false })
  }

  onChangeColorPicker (color) {
    this.props.onChangeLineColor(color.hex)
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

  renderItems () {
    // return (
    //   <ul className="nav nav-tabs hidden">
    //     <li>
    //       <a href="javascript:"
    //          className="option trash p-none" style={{display: obj ? 'block' : 'none'}}
    //          onClick={this.props.onClickDelete}>
    //         <i className="fa fa-trash-o" title="Delete" />
    //       </a>
    //     </li>
    //     <li>
    //       <div className="input-group colorpicker-element" style={{display: lineGroup ? 'block' : 'none'}}
    //            onClick={this.onClickColorPicker.bind(this)}>
    //         <div className="input-group-addon">
    //           <i className="color-preview" style={{background: lineGroup ? line.getStrokeColor() : 'black'}} />
    //         </div>
    //       </div>
    //
    //       {
    //         this.state.displayColorPicker
    //           ? <div style={popover}>
    //             <div style={cover} onClick={this.onCloseColorPicker.bind(this)}/>
    //             <ChromePicker color={lineGroup ? line.getStrokeColor() : 'black'} onChangeComplete={this.onChangeColorPicker.bind(this)}/>
    //           </div>
    //           : null
    //       }
    //
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: lineGroup ? 'block' : 'none'}} onClick={this.props.onClickLineWidthInc}>
    //         <i className="fa fa-expand" title="Increase Line Width" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: lineGroup ? 'block' : 'none'}} onClick={this.props.onClickLineWidthDec}>
    //         <i className="fa fa-compress" title="Decrease Line Width" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: text ? 'block' : 'none'}} onClick={this.props.onClickFontSizeUp}>
    //         <i className="fa fa-arrow-up" title="Increase Font Size" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: text ? 'block' : 'none'}} onClick={this.props.onClickFontSizeDown}>
    //         <i className="fa fa-arrow-down" title="Decrease Font Size" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: text ? 'block' : 'none'}} onClick={this.props.onClickAlignLeft}>
    //         <i className="fa fa-align-left" title="Align Left" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: text ? 'block' : 'none'}} onClick={this.props.onClickAlignCenter}>
    //         <i className="fa fa-align-center" title="Align Center" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: text ? 'block' : 'none'}} onClick={this.props.onClickAlignRight}>
    //         <i className="fa fa-align-right" title="Align Right" />
    //       </a>
    //     </li>
    //
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: hub ? 'block' : 'none'}}>
    //         <i className="fa fa-rotate-left" title="Rotate Left" />
    //       </a>
    //     </li>
    //     <li>
    //       <a href="javascript:;" className="option p-none" style={{display: hub ? 'block' : 'none'}}>
    //         <i className="fa fa-rotate-right" title="Rotate Right" />
    //       </a>
    //     </li>
    //
    //     <li>
    //       <a href="javascript:;" onClick={this.toggleLineTypes.bind(this)} className="option p-none" style={{display: line ? 'block' : 'none'}}>
    //         <i className="fa fa-reply" title="Change Type" />
    //       </a>
    //
    //       {this.renderLineTypes()}
    //     </li>
    //
    //     <li>
    //       <a href="javascript:;" onClick={this.props.onClickEdit} className={`option p-none ${this.props.editable ? 'option-active' : ''}`}>
    //         <i className="fa fa-edit" />
    //       </a>
    //     </li>
    //
    //     <li className={this.state.displayDevices ? '' : 'dropdown'} ref="liDevices">
    //       <a href="javascript:" onClick={this.onClickAdd.bind(this)} className={`option p-none ${this.state.displayDevices ? 'option-active' : ''}`}>
    //         <i className="fa fa-plus-square" title="Add" />
    //       </a>
    //     </li>
    //
    //     <li className="dropdown active">
    //       <a href="#" data-toggle="dropdown" className="dropdown-toggle" style={{display: 'none'}} />
    //       <ul className="dropdown-menu" />
    //     </li>
    //   </ul>
    // )
  }

  render () {
    // const cmap = this.state.cmap
    const obj = this.state.selectedObj

    // const line = obj ? cmap.selectedLine() : null
    // const lineGroup = line ? line.objectSubType === window.MapItemType.ShapeLineGroup : false
    // const text = obj ? cmap.selectedText() : null
    // const hub = obj ? cmap.selectedLonghub() : null
    //
    // const popover = {
    //   position: 'absolute',
    //   zIndex: '2',
    //   left: '-40px',
    //   top: '30px'
    //
    // }
    // const cover = {
    //   position: 'fixed',
    //   top: 0,
    //   right: 0,
    //   bottom: 0,
    //   left: 0
    // }

    return (
      <div className="panel-heading map-heading">
        <h4 className="panel-title">Topology</h4>
        <div className="panel-options" style={{top: 4}}>
          <IconButton style={buttonStyle} iconStyle={iconStyle} onTouchTap={this.props.onClickEdit}>
            <CreateIcon color="#545454"/>
          </IconButton>

          <IconButton style={buttonStyle} iconStyle={iconStyle} onTouchTap={this.onClickAdd.bind(this)} id="device-menu-button">
            <AddCircleIcon color="#545454"/>
          </IconButton>

          <IconButton style={{...buttonStyle, display: obj ? 'inline-block' : 'none'}} iconStyle={iconStyle} onTouchTap={this.props.onClickDelete}>
            <DeleteIcon color="#545454"/>
          </IconButton>

          {
            this.state.displayDevices
              ? <DeviceMenu {...this.props} onClickItem={this.props.onClickDeviceItem} selectedItem={this.props.selectedItem}/>
              : null
          }
          {this.renderItems()}
        </div>
      </div>
    )
  }
}

Toolbar.defaultProps = {
  onClickEdit: null,
  editable: false,

  selectedItem: {},
  onClickDeviceItem: null
}

import React from 'react'

import { DragSource } from 'react-dnd'
import { extImageBaseUrl, DragTypes } from 'shared/Global'

const deviceSource = {
  beginDrag (props) {
    // Return the data describing the dragged item
    const item = {
      img: props.img,
      title: props.title,
      template: props.template
    }
    return item
  },

  endDrag () {

  }
}

function collect (connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    currentOffset: monitor.getSourceClientOffset(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
  }
}

class DeviceImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { connectDragSource } = this.props

    return (
      connectDragSource(
        <div className="link">
          <span className="pull-left item-icon" ref="div">
            <img src={`${extImageBaseUrl}${this.props.img}`} alt=""/>
          </span>

          <span className="item-text">
            <strong>{this.props.title}</strong>
          </span>
        </div>
      )
    )
  }
}

export default DragSource(DragTypes.DEVICE, deviceSource, collect)(DeviceImg)

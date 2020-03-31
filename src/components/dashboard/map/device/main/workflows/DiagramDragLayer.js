import React from 'react'
import { DragLayer } from 'react-dnd'

import { DragTypes } from 'shared/Global'
import { workflowItems } from './DiagramItems'

function collect (monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  }
}

const layerStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles (currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  return {
    position: 'absolute',
    left: `${x - 18}px`,
    top: `${y - 18}px`,
    width: '36px',
    height: '36px'
  }
}

class DiagramDragLayer extends React.Component {

  onRefContainer (el) {
    this.containerEl = el
  }

  renderItem (type, item, style) {
    switch (type) {
      case DragTypes.WORKFLOW:
        return (
          <svg style={style}>
            {workflowItems[item.imgIndex].img}
          </svg>
        )
      default:
        return null
    }
  }

  render () {
    const { item, itemType, isDragging, currentOffset } = this.props
    if (!isDragging || !currentOffset) return null

    const rt = this.containerEl ? this.containerEl.getClientRects()[0] : {left: 0, top: 0}

    return (
      <div style={layerStyles} ref={this.onRefContainer.bind(this)}>
        {this.renderItem(itemType, item, getItemStyles({
          x: currentOffset.x - rt.left,
          y: currentOffset.y - rt.top
        }))}
      </div>
    )
  }
}

export default DragLayer(collect)(DiagramDragLayer)

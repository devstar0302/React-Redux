import React from 'react'
import { DropTarget } from 'react-dnd'
import { findIndex, assign } from 'lodash'

import { DragTypes, DiagramTypes } from 'shared/Global'
import DRect from './diagram/DRect'
import { workflowItems, handlePoints } from './DiagramItems'

import { findStepLines } from './diagram/LineUtil'

function collect (connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

const canvasTarget = {
  canDrop () {
    return true
  },

  drop (props, monitor, component) {
    props.onDrop(monitor.getItem(), monitor.getClientOffset(), component)
  }
}

class DiagramPanel extends React.Component {

  onSvgRef (el) {
    this.svgEl = el
  }

  // //////////////////////////////////////////////////

  onMouseDownObject (obj, e) {
    console.log('onMouseDownObject')
    this.props.setDiagramMouseDown(true, this.convertEventPosition(e), 'object')
    this.props.selectDiagramObject(obj)
    e.stopPropagation()
  }

  onMouseOverObject (obj) {
    this.props.setHoverDiagramObject(obj)
  }

  onMouseOutObject (obj) {
    this.props.clearHoverDiagramObject(obj)
  }

  onDblClickObject (obj) {
    this.props.selectDiagramObject(obj)
    this.props.openDiagramObjectModal(obj)
  }

  // ///////////////////////////////////////////////////

  onMouseOverHoverPoint (object, point) {
    this.props.setHoverPoint(point)
  }

  // ///////////////////////////////////////////////////

  onMouseDownHandlePoint (point, e) {
    this.props.setDiagramMouseDown(true, this.convertEventPosition(e), 'resize-handle')
    this.props.setDiagramResizingPoint(point)
    e.stopPropagation()
  }

  // ///////////////////////////////////////////////////

  convertEventPosition (e) {
    const rt = this.svgEl.getClientRects()[0]
    return {
      x: e.clientX - rt.left,
      y: e.clientY - rt.top
    }
  }

  onDragObjectStart (e) {
    this.props.setDiagramDragging(true)
  }

  onDraggingObject (e) {
  }

  onDragObjectEnd (e) {
    const { mouseDownPos, cursorPos } = this.props
    this.props.moveDiagramSelectedObjects({
      x: cursorPos.x - mouseDownPos.x,
      y: cursorPos.y - mouseDownPos.y
    })
  }

  // ///////////////////////////////////////////////////

  onResizeObjectStart (e) {
    this.props.setDiagramResizing(true)
  }

  onResizeObject (offset) {
    this.props.resizeDiagramSelectedObjects(offset)
  }

  onResizeObjectEnd (e) {

  }

  // ///////////////////////////////////////////////////

  onMouseDownLineHandle (point, pos, object, e) {
    console.log(`onMouseDownLineHandle ${point}`)
    this.props.setDiagramMouseDown(true, this.convertEventPosition(e), 'line-handle')
    this.props.setDiagramLineDrawing(true, false, null)
    this.props.setDiagramLineStartPoint(pos, object, point)
    this.props.setDiagramLineEndPoint(null, null, -1)
    e.stopPropagation()
  }

  onLineDraw (pos) {
    const { hovered, hoverPoint, isLineDrawingStart } = this.props
    if (isLineDrawingStart) {
      this.props.setDiagramLineStartPoint(pos, hovered, hoverPoint)
    } else {
      this.props.setDiagramLineEndPoint(pos, hovered, hoverPoint)
    }
  }

  onLineDrawEnd (e) {
    const { lineEndObject, lineEndObjectPoint, lineStartObject, lineStartObjectPoint, lastId, drawingLine } = this.props
    if (!lineEndObject || lineEndObjectPoint < 0 || !lineStartObject || lineStartObjectPoint < 0) return
    if (lineStartObject.id === lineEndObject.id) return

    if (drawingLine) {
      this.props.updateDiagramLine(assign({}, drawingLine, {
        startObject: lineStartObject,
        startPoint: lineStartObjectPoint,
        endObject: lineEndObject,
        endPoint: lineEndObjectPoint
      }))
    } else {
      this.props.addDiagramLine({
        id: lastId + 1,
        type: DiagramTypes.LINE,
        startObject: lineStartObject,
        startPoint: lineStartObjectPoint,
        endObject: lineEndObject,
        endPoint: lineEndObjectPoint
      })
    }
  }

  // ///////////////////////////////////////////////////

  onMouseDownLine (line, e) {
    console.log('onMouseDownLine')
    this.props.setDiagramMouseDown(true, this.convertEventPosition(e), 'line')
    this.props.selectDiagramObject(line)
    e.stopPropagation()
  }

  onMouseDownLineMove (line, isStart, otherPos, e) {
    console.log('onMouseDownLineMove')

    this.props.setDiagramMouseDown(true, this.convertEventPosition(e), 'line-handle')
    this.props.setDiagramLineDrawing(true, isStart, line)
    if (isStart) {
      this.props.setDiagramLineStartPoint(null, null, -1)
      this.props.setDiagramLineEndPoint(otherPos, line.endObject, line.endPoint)
    } else {
      this.props.setDiagramLineStartPoint(otherPos, line.startObject, line.startPoint)
      this.props.setDiagramLineEndPoint(null, null, -1)
    }

    e.stopPropagation()
  }

  // ///////////////////////////////////////////////////

  onMouseDownPanel (e) {
    this.props.selectDiagramObject(null)
  }

  onMouseMovePanel (e) {
    const { isMouseDown, isDragging, isResizing, isLineDrawing, mouseDownObject, cursorPos } = this.props

    // Object dragging
    if (e.buttons === 1 && isMouseDown) {
      const pos = this.convertEventPosition(e)
      const offset = {
        x: pos.x - cursorPos.x,
        y: pos.y - cursorPos.y
      }

      this.props.setDiagramCursorPos(pos)

      if (mouseDownObject === 'object') {
        if (!isDragging) this.onDragObjectStart(e)
        this.onDraggingObject(e)
      } else if (mouseDownObject === 'resize-handle') {
        if (!isResizing) this.onResizeObjectStart(e)
        this.onResizeObject(offset)
      } else if (mouseDownObject === 'line-handle') {
        this.onLineDraw(cursorPos)
      }
    } else {
      if (isDragging || isResizing || isLineDrawing) this.props.setDiagramMouseDown(false)
    }
  }

  onMouseUpPanel (e) {
    const { isDragging, isResizing, isLineDrawing } = this.props
    if (isDragging) {
      this.onDragObjectEnd(e)
    }
    if (isResizing) {
      this.onResizeObjectEnd(e)
    }
    if (isLineDrawing) {
      this.onLineDrawEnd(e)
    }
    this.props.setDiagramMouseDown(false)
  }

  // ///////////////////////////////////////////////////

  renderObject (obj) {
    const ItemObject = workflowItems[obj.imgIndex].component || DRect
    const listeners = {
      className: 'object',
      onMouseDown: this.onMouseDownObject.bind(this, obj),
      onMouseOver: this.onMouseOverObject.bind(this, obj),
      onDoubleClick: this.onDblClickObject.bind(this, obj)
    }

    return (
      <ItemObject key={obj.id} {...obj} listeners={listeners}/>
    )
  }

  renderObjects () {
    const { objects } = this.props

    return objects.map(obj => this.renderObject(obj))
  }

  renderLine (line) {
    const startObject = this.props.objects[findIndex(this.props.objects, {id: line.startObject.id})]
    const endObject = this.props.objects[findIndex(this.props.objects, {id: line.endObject.id})]
    const startItem = workflowItems[startObject.imgIndex]
    const startPos = startItem.getConnectionPoint(startObject, line.startPoint)
    const endItem = workflowItems[endObject.imgIndex]
    const endPos = endItem.getConnectionPoint(endObject, line.endPoint)

    const points = findStepLines(startItem, startPos, line.startPoint, endItem, endPos, line.endPoint)

    return (
      <g key={`line-${line.id}`} style={{cursor: 'move'}}>
        <path d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`} stroke="#000000" fill="none" strokeMiterlimit="10" markerEnd="url(#arrowEnd)"
          onMouseDown={this.onMouseDownLine.bind(this, line)} pointerEvents="stroke"/>
      </g>
    )
  }

  renderLines () {
    const { lines } = this.props

    return lines.map(line => this.renderLine(line))
  }

  renderDrawingLines () {
    const { isLineDrawing, lineStart, lineEnd, lineStartObject, lineEndObject, lineStartObjectPoint, lineEndObjectPoint, drawingLine } = this.props
    if (!isLineDrawing || !lineEnd || !lineStart) return null

    const attrs = {
      stroke: drawingLine ? '#00a8ff' : '#000000',
      fill: 'none',
      strokeMiterlimit: '10'
    }
    if (drawingLine) {
      assign(attrs, { strokeDasharray: '3 3' })
    }

    if (lineEndObjectPoint < 0 || lineStartObjectPoint < 0) {
      return (
        <path d={`M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`} {...attrs}/>
      )
    }

    const startItem = lineStartObject ? workflowItems[lineStartObject.imgIndex] : null
    const endItem = lineEndObject ? workflowItems[lineEndObject.imgIndex] : null

    const points = findStepLines(startItem, lineStart, lineStartObjectPoint, endItem, lineEnd, lineEndObjectPoint)
    return (
      <path d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`} {...attrs}/>
    )
  }

  renderSelection (obj) {
    const { x, y, w, h, type } = obj

    if (type === DiagramTypes.OBJECT) {
      return (
        <g key={`sel-${obj.id}`}>
          <g style={{cursor: 'move'}}>
            <rect x={x} y={y} width={w} height={h} fill="none" stroke="#00a8ff" strokeDasharray="3 3" pointerEvents="none"/>
          </g>
          {
            handlePoints.map((p, index) =>
              <g key={index} style={{cursor: p.cursor}}>
                <image x={x + w * p.x - 8.5} y={y + h * p.y - 8.5}
                  className="resize-handle"
                  onMouseDown={this.onMouseDownHandlePoint.bind(this, index)}
                  width="17"
                  height="17"
                  href="/resources/images/dashboard/map/device/main/workflows/handle.png"
                  preserveAspectRatio="none"/>
              </g>
            )
          }
        </g>
      )
    } else if (type === DiagramTypes.LINE) {
      const { objects } = this.props
      const { startPoint, endPoint } = obj
      const startObject = objects[findIndex(objects, { id: obj.startObject.id })]
      const endObject = objects[findIndex(objects, { id: obj.endObject.id })]
      const startItem = workflowItems[startObject.imgIndex]
      const endItem = workflowItems[endObject.imgIndex]
      const startPos = startItem.getConnectionPoint(startObject, startPoint)
      const endPos = endItem.getConnectionPoint(endObject, endPoint)

      return (
        <g key={`sel-${obj.id}`}>
          <g style={{cursor: 'move'}}>
            <image x={startPos.x - 8.5} y={startPos.y - 8.5} width="17" height="17" href="/resources/images/dashboard/map/device/main/workflows/handle.png" preserveAspectRatio="none"
              onMouseDown={this.onMouseDownLineMove.bind(this, obj, true, endPos)}/>
          </g>
          <g style={{cursor: 'move'}}>
            <image x={endPos.x - 8.5} y={endPos.y - 8.5} width="17" height="17" href="/resources/images/dashboard/map/device/main/workflows/handle.png" preserveAspectRatio="none"
              onMouseDown={this.onMouseDownLineMove.bind(this, obj, false, startPos)}/>
          </g>
        </g>
      )
    }
  }

  renderSelected () {
    const { selected } = this.props
    return selected.map(obj => this.renderSelection(obj))
  }

  renderHovered () {
    const { hovered, selected, hoverPoint, isDragging } = this.props
    if (!hovered || isDragging) return null
    if (selected && selected.filter(s => s.id === hovered.id).length > 0) return null

    const item = workflowItems[hovered.imgIndex]

    let points = []
    let hoverPointComp
    for (let i = 0; i < item.connectionPoints; i++) {
      const xy = item.getConnectionPoint(hovered, i)
      points.push(
        <g key={i}>
          <image x={xy.x - 2.5} y={xy.y - 2.5}
            width="5" height="5" href="/resources/images/dashboard/map/device/workflows/point.gif" preserveAspectRatio="none"
            className="line-handle"
            pointerEvents="all"
            onMouseDown={this.onMouseDownLineHandle.bind(this, i, xy, hovered)}
            onMouseOver={this.onMouseOverHoverPoint.bind(this, hovered, i)}/>
        </g>
      )

      if (i === hoverPoint) {
        hoverPointComp = (
          <g>
            <ellipse cx={xy.x} cy={xy.y} rx="10" ry="10" fillOpacity="0.3" fill="#00ff00" stroke="#00ff00" strokeOpacity="0.3" pointerEvents="none"/>
          </g>
        )
      }
    }

    const {x, y, w, h} = hovered

    return (
      <g pointerEvents="all"
        onMouseLeave={this.onMouseOutObject.bind(this, hovered)}>
        <g style={{cursor: 'move'}}>
          <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} fill="none" stroke="transparent" className="object"
            onMouseDown={this.onMouseDownObject.bind(this, hovered)}/>
          {hoverPointComp}
        </g>
        <g>
          {points}
        </g>
      </g>
    )
  }

  renderDragging () {
    const { isDragging, mouseDownPos, cursorPos, selected } = this.props
    if (!isDragging) return null

    const offsetX = cursorPos.x - mouseDownPos.x
    const offsetY = cursorPos.y - mouseDownPos.y

    return selected.filter(obj => obj.type === DiagramTypes.OBJECT).map(obj =>
      <g key={`dragging-${obj.id}`} style={{cursor: 'move'}}>
        <rect x={obj.x + offsetX} y={obj.y + offsetY} width={obj.w} height={obj.h} fill="none" stroke="#000000" strokeDasharray="3 3" pointerEvents="none"/>
      </g>
    )
  }

  renderDraggingHint () {
    const { isDragging, mouseDownPos, cursorPos, selected } = this.props
    if (!isDragging) return null

    const object = selected.filter(obj => obj.type === DiagramTypes.OBJECT)[0]
    const {w, h} = object
    const x = parseInt(object.x + cursorPos.x - mouseDownPos.x, 10)
    const y = parseInt(object.y + cursorPos.y - mouseDownPos.y, 10)

    const text = `${x}, ${y}`
    return (
      <div className="geHint" style={{left: `${x + w / 2 - 6.1 * text.length / 2 - 16}px`, top: `${y + h + 16}px`}}>{text}</div>
    )
  }

  renderDefs () {
    return (
      <defs>
        <marker id="arrowEnd" viewBox="0 0 8000 8000" refX="280" refY="150" markerUnits="strokeWidth" markerWidth="300" markerHeight="300" orient="auto" fill="RGB(0,0,0)" strokeLinejoin="bevel">
          <path stroke="RGB(0,0,0)" strokeWidth="5" d="M2 59,293 148,1 243,121 151,Z"/>
        </marker>
      </defs>
    )
  }

  render () {
    const { connectDropTarget, backImg } = this.props

    const style = {
      backgroundImage: `url(data:image/svg+xml;base64,${backImg})`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255)'
    }
    return connectDropTarget(
      <div className="draw-panel flex-1"
        onMouseDown={this.onMouseDownPanel.bind(this)}
        onMouseMove={this.onMouseMovePanel.bind(this)}
        onMouseUp={this.onMouseUpPanel.bind(this)}>
        <svg style={style} ref={this.onSvgRef.bind(this)}>
          {this.renderDefs()}
          {this.renderLines()}
          {this.renderObjects()}
          {this.renderDrawingLines()}
          <g>
            {this.renderSelected()}
            {this.renderHovered()}
            {this.renderDragging()}
          </g>
        </svg>
        {this.renderDraggingHint()}
      </div>
    )
  }
}
export default DropTarget(DragTypes.WORKFLOW, canvasTarget, collect)(DiagramPanel)

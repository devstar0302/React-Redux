import React from 'react'
import { connect } from 'react-redux'

import DiagramView from 'components/dashboard/map/device/main/workflows/DiagramView'

import {
  closeDeviceWfDiagramModal,

  addDiagramObject,
  updateDiagramObject,
  selectDiagramObject,
  setHoverDiagramObject,
  clearHoverDiagramObject,
  setHoverPoint,
  setDiagramMouseDown,
  setDiagramDragging,
  setDiagramCursorPos,
  moveDiagramSelectedObjects,
  setDiagramResizingPoint,
  setDiagramResizing,
  resizeDiagramSelectedObjects,
  setDiagramLineDrawing,
  setDiagramLineStartPoint,
  setDiagramLineEndPoint,
  addDiagramLine,
  updateDiagramLine,

  openDiagramObjectModal,
  closeDiagramObjectModal,
  removeDiagramSelectedObjects
} from 'actions'

class DiagramViewContainer extends React.Component {
  render () {
    return (
      <DiagramView {...this.props} />
    )
  }
}
export default connect(
  state => ({
    objects: state.diagram.objects,
    lastId: state.diagram.lastId,

    backImg: state.diagram.backImg,

    selected: state.diagram.selected,
    hovered: state.diagram.hovered,
    hoverPoint: state.diagram.hoverPoint,
    isMouseDown: state.diagram.isMouseDown,
    mouseDownPos: state.diagram.mouseDownPos,
    mouseDownObject: state.diagram.mouseDownObject,
    resizePoint: state.diagram.resizePoint,
    isDragging: state.diagram.isDragging,
    cursorPos: state.diagram.cursorPos,
    isResizing: state.diagram.isResizing,

    lines: state.diagram.lines,
    isLineDrawing: state.diagram.isLineDrawing,
    isLineDrawingStart: state.diagram.isLineDrawingStart,
    drawingLine: state.diagram.drawingLine,
    lineStart: state.diagram.lineStart,
    lineEnd: state.diagram.lineEnd,
    lineStartObject: state.diagram.lineStartObject,
    lineStartObjectPoint: state.diagram.lineStartObjectPoint,
    lineEndObject: state.diagram.lineEndObject,
    lineEndObjectPoint: state.diagram.lineEndObjectPoint,

    objectModalOpen: state.diagram.objectModalOpen,
    objectConfig: state.diagram.objectConfig
  }), {
    closeDeviceWfDiagramModal,
    addDiagramObject,
    updateDiagramObject,

    selectDiagramObject,
    setHoverDiagramObject,
    clearHoverDiagramObject,
    setHoverPoint,
    setDiagramMouseDown,
    setDiagramDragging,
    setDiagramCursorPos,
    moveDiagramSelectedObjects,
    setDiagramResizingPoint,
    setDiagramResizing,
    resizeDiagramSelectedObjects,
    setDiagramLineDrawing,
    setDiagramLineStartPoint,
    setDiagramLineEndPoint,
    addDiagramLine,
    updateDiagramLine,
    removeDiagramSelectedObjects,

    openDiagramObjectModal,
    closeDiagramObjectModal
  }
)(DiagramViewContainer)

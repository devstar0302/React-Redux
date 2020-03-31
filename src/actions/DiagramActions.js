import {

  ADD_DIAGRAM_OBJECT,
  UPDATE_DIAGRAM_OBJECT,
  SELECT_DIAGRAM_OBJECT,

  SET_HOVER_DIAGRAM_OBJECT,
  CLEAR_HOVER_DIAGRAM_OBJECT,

  SET_HOVER_POINT,

  SET_DIAGRAM_MOUSE_DOWN,
  SET_DIAGRAM_DRAGGING,
  SET_DIAGRAM_CURSOR_POS,

  MOVE_DIAGRAM_SELECTED_OBJECTS,

  SET_DIAGRAM_RESIZING,
  SET_DIAGRAM_RESIZING_POINT,
  RESIZE_DIAGRAM_SELECTED_OBJECTS,

  SET_DIAGRAM_LINE_DRAWING,
  SET_DIAGRAM_LINE_START_POINT,
  SET_DIAGRAM_LINE_END_POINT,

  ADD_DIAGRAM_LINE,
  UPDATE_DIAGRAM_LINE,

  OPEN_DIAGRAM_OBJECT_MODAL,
  CLOSE_DIAGRAM_OBJECT_MODAL,

  SET_DIAGRAM_EDITING_TEXT,
  REMOVE_DIAGRAM_SELECTED_OBJECTS

} from './types'

export function addDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: ADD_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function updateDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: UPDATE_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function selectDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: SELECT_DIAGRAM_OBJECT,
      data: object ? [object] : []
    })
  }
}

export function setHoverDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: SET_HOVER_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function clearHoverDiagramObject (object) {
  return dispatch => {
    dispatch({
      type: CLEAR_HOVER_DIAGRAM_OBJECT,
      data: object
    })
  }
}

export function setHoverPoint (point) {
  return dispatch => {
    dispatch({
      type: SET_HOVER_POINT,
      data: point
    })
  }
}

export function setDiagramMouseDown (isDown, pos, downOn) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_MOUSE_DOWN,
      data: isDown,
      pos,
      downOn
    })
  }
}

export function setDiagramDragging (dragging) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_DRAGGING,
      data: dragging
    })
  }
}

export function setDiagramCursorPos (pos) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_CURSOR_POS,
      data: pos
    })
  }
}

export function moveDiagramSelectedObjects (offset) {
  return dispatch => {
    dispatch({
      type: MOVE_DIAGRAM_SELECTED_OBJECTS,
      data: offset
    })
  }
}

export function setDiagramResizing (resizing) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_RESIZING,
      data: resizing
    })
  }
}

export function setDiagramResizingPoint (point) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_RESIZING_POINT,
      data: point
    })
  }
}

export function resizeDiagramSelectedObjects (offset) {
  return dispatch => {
    dispatch({
      type: RESIZE_DIAGRAM_SELECTED_OBJECTS,
      data: offset
    })
  }
}

export function setDiagramLineDrawing (isDrawing, isDrawingStart, drawingLine) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_LINE_DRAWING,
      data: isDrawing,
      isDrawingStart,
      drawingLine
    })
  }
}

export function setDiagramLineStartPoint (pos, object, connectionPoint) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_LINE_START_POINT,
      pos,
      object,
      connectionPoint
    })
  }
}

export function setDiagramLineEndPoint (pos, object, connectionPoint) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_LINE_END_POINT,
      pos,
      object,
      connectionPoint
    })
  }
}

export function addDiagramLine (line) {
  return dispatch => {
    dispatch({
      type: ADD_DIAGRAM_LINE,
      data: line
    })
  }
}

export function updateDiagramLine (line) {
  return dispatch => {
    dispatch({
      type: UPDATE_DIAGRAM_LINE,
      line
    })
  }
}

export function openDiagramObjectModal (config) {
  return dispatch => {
    dispatch({
      type: OPEN_DIAGRAM_OBJECT_MODAL,
      config
    })
  }
}

export function closeDiagramObjectModal () {
  return dispatch => {
    dispatch({
      type: CLOSE_DIAGRAM_OBJECT_MODAL
    })
  }
}

export function setDiagramEditingText (object) {
  return dispatch => {
    dispatch({
      type: SET_DIAGRAM_EDITING_TEXT,
      object
    })
  }
}

export function removeDiagramSelectedObjects () {
  return dispatch => {
    dispatch({
      type: REMOVE_DIAGRAM_SELECTED_OBJECTS
    })
  }
}

import { concat, findIndex } from 'lodash'
import { DiagramTypes } from 'shared/Global'
import {
  ADD_DIAGRAM_OBJECT,
  UPDATE_DIAGRAM_OBJECT,

  OPEN_DEVICE_WF_DIAGRAM_MODAL,
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
} from 'actions/types'

const initialState = {
  objects: [],
  lines: [],
  lastId: 0,

  backImg: window.btoa('<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 0 10 L 40 10 M 10 0 L 10 40 M 0 20 L 40 20 M 20 0 L 20 40 M 0 30 L 40 30 M 30 0 L 30 40" fill="none" stroke="#e0e0e0" opacity="0.2" stroke-width="1"/><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e0e0" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>'),

  selected: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case OPEN_DEVICE_WF_DIAGRAM_MODAL: {
      const {data} = action
      let objects = []
      let lastId = 100
      let lines = []
      if (data) {
        try {
          let parsed = JSON.parse(data)
          if (parsed.objects) objects = parsed.objects
          if (parsed.lines) lines = parsed.lines
          if (parsed.lastId) lastId = parsed.lastId
        } catch (e) {
          console.log(e)
        }
      }
      return { ...state, objects, lastId, lines, selected: [], hovered: null, isDragging: false, isResizing: false, isLineDrawing: false }
    }

    case ADD_DIAGRAM_OBJECT:
      return { ...state, objects: concat(state.objects, action.data), lastId: state.lastId + 1 }

    case UPDATE_DIAGRAM_OBJECT:
      return { ...state, objects: state.objects.map(m => m.id === action.data.id ? action.data : m) }

    case SELECT_DIAGRAM_OBJECT:
      return { ...state, selected: action.data, hovered: null }

    case SET_HOVER_DIAGRAM_OBJECT:
      return { ...state, hovered: action.data, hoverPoint: -1 }

    case CLEAR_HOVER_DIAGRAM_OBJECT: {
      const {hovered} = state
      return { ...state, hovered: hovered && hovered.id === action.data.id ? null : hovered }
    }

    case SET_HOVER_POINT:
      return { ...state, hoverPoint: action.data }

    case SET_DIAGRAM_MOUSE_DOWN:
      return {
        ...state,
        isMouseDown: action.data,
        mouseDownPos: action.data ? action.pos : state.mouseDownPos,
        mouseDownObject: action.downOn,
        isDragging: false,
        isResizing: false,
        isLineDrawing: action.data ? state.isLineDrawing : false,
        resizePoint: action.data ? state.resizePoint : -1,
        cursorPos: action.pos
      }

    case SET_DIAGRAM_DRAGGING:
      return { ...state, isDragging: action.data }

    case SET_DIAGRAM_CURSOR_POS:
      return { ...state, cursorPos: action.data }

    case MOVE_DIAGRAM_SELECTED_OBJECTS:
      return {
        ...state,
        selected: state.selected.map(obj => {
          if (obj.type !== DiagramTypes.OBJECT) return obj

          obj.x += action.data.x
          obj.y += action.data.y
          return obj
        })
      }

    case SET_DIAGRAM_RESIZING_POINT:
      return { ...state, resizePoint: action.data }

    case SET_DIAGRAM_RESIZING:
      return { ...state, isResizing: action.data }

    case RESIZE_DIAGRAM_SELECTED_OBJECTS:
      return {
        ...state,
        selected: state.selected.map(obj => {
          if (obj.type !== DiagramTypes.OBJECT) return obj

          switch (state.resizePoint) {
            case 0:
              obj.x += action.data.x
              obj.y += action.data.y
              obj.w -= action.data.x
              obj.h -= action.data.y
              break

            case 1:
              obj.y += action.data.y
              obj.h -= action.data.y
              break

            case 2:
              obj.y += action.data.y
              obj.w += action.data.x
              obj.h -= action.data.y
              break

            case 3:
              obj.x += action.data.x
              obj.w -= action.data.x
              break

            case 4:
              obj.w += action.data.x
              break

            case 5:
              obj.x += action.data.x
              obj.w -= action.data.x
              obj.h += action.data.y
              break

            case 6:
              obj.h += action.data.y
              break

            case 7:
              obj.w += action.data.x
              obj.h += action.data.y
              break

            default:
              break
          }
          return obj
        })
      }

    case SET_DIAGRAM_LINE_DRAWING:
      return { ...state, isLineDrawing: action.data, isLineDrawingStart: action.isDrawingStart, drawingLine: action.drawingLine, selected: [] }

    case SET_DIAGRAM_LINE_START_POINT:
      return { ...state, lineStart: action.pos, lineStartObject: action.object, lineStartObjectPoint: action.connectionPoint }

    case SET_DIAGRAM_LINE_END_POINT:
      return { ...state, lineEnd: action.pos, lineEndObject: action.object, lineEndObjectPoint: action.connectionPoint }

    case ADD_DIAGRAM_LINE:
      return { ...state, lines: concat(state.lines, action.data), lastId: state.lastId + 1 }

    case UPDATE_DIAGRAM_LINE:
      return { ...state, lines: state.lines.map(m => m.id === action.line.id ? action.line : m) }

    case OPEN_DIAGRAM_OBJECT_MODAL:
      return { ...state, objectModalOpen: true, objectConfig: action.config }

    case CLOSE_DIAGRAM_OBJECT_MODAL:
      return { ...state, objectModalOpen: false }

    case SET_DIAGRAM_EDITING_TEXT:
      return { ...state, object: action.object }

    case REMOVE_DIAGRAM_SELECTED_OBJECTS: {
      const { objects, lines, selected } = state
      return {
        ...state,
        objects: objects.filter(obj => findIndex(selected, { id: obj.id, type: DiagramTypes.OBJECT }) < 0),
        lines: lines.filter(line => {
          if (findIndex(selected, { id: line.id, type: DiagramTypes.LINE }) >= 0) return false
          if (findIndex(selected, { id: line.startObject.id, type: DiagramTypes.OBJECT }) >= 0) return false
          if (findIndex(selected, { id: line.endObject.id, type: DiagramTypes.OBJECT }) >= 0) return false
          return true
        }),
        selected: [],

        hovered: null,
        isDragging: false,
        isResizing: false,
        isLineDrawing: false
      }
    }
    default:
      return state
  }
}

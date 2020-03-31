import {
  SHOW_TAG_MODAL,
  FETCH_TAGS,
  ADD_TAG,
  UPDATE_TAG,
  REMOVE_TAG,
  SELECT_TAG,

  MULTI_SELECT_TAG,
  FETCH_DEVICE_BY_TAGS,
  FETCH_WORKFLOW_BY_TAGS,
  FETCH_MONITORTPL_BY_TAGS,
  FETCH_DEVICETPL_BY_TAGS,
  FETCH_PARSERTYPE_BY_TAGS
} from 'actions/types'

const initialState = {
  tags: [],
  tagDraw: 1,
  selectedTags: [],
  multiSelTags: [],

  tagDevices: [],
  tagWorkflows: [],
  tagParserTypes: [],
  tagDeviceTpls: [],
  tagMonitorTpls: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_TAG_MODAL:
      return { ...state, tagModalOpen: !!action.visible, editTag: action.tag }
    case FETCH_TAGS:
      return { ...state, tags: action.data }
    case ADD_TAG:
      return { ...state, tagDraw: state.tagDraw + 1, tags: [...state.tags, action.data] }
    case UPDATE_TAG:
      return { ...state, tagDraw: state.tagDraw + 1, tags: state.tags.map(p => p.id === action.data.id ? action.data : p) }
    case REMOVE_TAG:
      return { ...state, tagDraw: state.tagDraw + 1, tags: state.tags.filter(p => p.id !== action.data.id) }
    case SELECT_TAG:
      return { ...state, selectedTags: action.tags || [] }
    case MULTI_SELECT_TAG:
      return {...state, multiSelTags: action.tags}
    case FETCH_DEVICE_BY_TAGS:
      return {...state, tagDevices: action.data}
    case FETCH_WORKFLOW_BY_TAGS:
      return {...state, tagWorkflows: action.data}
    case FETCH_DEVICETPL_BY_TAGS:
      return {...state, tagDeviceTpls: action.data}
    case FETCH_MONITORTPL_BY_TAGS:
      return {...state, tagMonitorTpls: action.data}
    case FETCH_PARSERTYPE_BY_TAGS:
      return {...state, tagParserTypes: action.data}
    default:
      return state
  }
}

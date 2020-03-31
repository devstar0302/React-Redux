import moment from 'moment'
import {
  SEARCH_INCIDENTS,
  SEARCH_INCIDENT_DEVICES,
  UPDATE_DEVICE_INCIDENT,
  FIX_ALL_INCIDENTS_BY_TYPE,
  UPDATE_SEARCH_PARAMS,
  UPDATE_SEARCH_FIELDS,
  OPEN_FIELDS_POPOVER,
  CLOSE_FIELDS_POPOVER,
  FETCH_FIELD_TOP_VALUES,
  UPDATE_QUERY_CHIPS,
  UPDATE_INCIDENTS_PARAMS,
  UPDATE_QUERY_PARAMS,

  UPDATE_SEARCH_VIEW_FILTER,
  SHOW_VIEW_FILTER_MODAL,
  SELECT_VIEW_FILTER,

  FETCH_SEARCH_OPTIONS,
  ADD_SEARCH_OPTION,
  UPDATE_SEARCH_OPTION,
  REMOVE_SEARCH_OPTION,
  FETCH_SYS_SEARCH_OPTIONS,

  OPEN_SEARCH_SAVE_POPOVER,
  CLOSE_SEARCH_SAVE_POPOVER,
  CHANGE_SEARCH_SAVE_TYPE,

  OPEN_SEARCH_WF_MODAL,
  CLOSE_SEARCH_WF_MODAL,
  SELECT_SEARCH_WF_CATEGORY,
  CHANGE_SEARCH_WF_FILTER,
  SELECT_WF_ROW,
  SELECT_SEARCH_WF,
  ADD_SEARCH_WF,
  REMOVE_SEARCH_WF,
  REPLACE_SEARCH_WFS,
  SHOW_SEARCH_TAG_MODAL,
  UPDATE_SEARCH_TAGS,

  SHOW_SAVED_SEARCH_MODAL,
  UPDATE_SAVED_SEARCH_KEYWORD,
  SELECT_SEARCH,
  SET_LOADING_SEARCH_OPTIONS,
  SHOW_REL_DEVICES_POPOVER,
  FETCH_REL_DEVICES,
  SHOW_IRREL_DEVICES_MODAL,
  FETCH_IRREL_DEVICES,
  SHOW_SEARCH_FIELDS_MODAL,
  UPDATE_SELECTED_SEARCH_FIELDS,
  UPDATE_REL_DEVICE_FIELDS,

  SHARE_SAVED_SEARCH,
  SHOW_SEARCH_GRAPH_MODAL,
  FETCH_SEARCH_RECORD_COUNT,
  MAXIMIZE_SEARCH_GRAPH,

  UPDATE_GRAPH_PARAMS,

  REFRESH_SEARCH,
  TOGGLE_VIEW_COL,
  RESET_VIEW_COLS,
  COLLAPSE_SEARCH_FIELDS,
  SHOW_SEARCH_MONITOR_MODAL,

  UPDATE_SEARCH_MONITOR
} from 'actions/types'
import { concat } from 'lodash'

const initialState = {
  incidents: [],
  incidentDevices: [],
  incidentDraw: 1,
  queryParams: {
    draw: 1,
    q: [
      '(type:all)',
      '(severity:HIGH OR MEDIUM)',
      `(from:Yesterday)`
    ].join(' AND ')
  },
  incidentParams: {
    severity: ['HIGH', 'MEDIUM'],
    fixed: 'false',
    description: '',
    deviceid: '*',
    afterStartTimestamp: moment().startOf('year').valueOf(),
    beforeStartTimestamp: moment().endOf('year').valueOf(),
    sort: 'startTimestamp,desc',
    draw: 1
  },
  graphParams: {
    stepBy: '1',
    stepUnit: 'day'
  },
  queryChips: [],
  fields: [],
  fieldTopValues: [],
  selectedWfs: [],
  searchTags: [],

  searchDraw: 1,
  searchOptions: [],
  sysSearchOptions: [],
  selectedCategory: '',
  workflowFilter: '',

  relDevices: [],
  irrelDevices: [],
  searchFields: ['ip'],
  selectedSearchFields: [],
  searchRecordCounts: [],
  savedSearchKeyword: '',
  searchSaveType: 'new',

  viewCols: [],

  searchFieldsVisible: true
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SEARCH_INCIDENTS:
      return {...state, incidents: action.data}
    case UPDATE_DEVICE_INCIDENT: {
      const incidents = state.incidents.map(u => {
        if (u.id === action.data.id) return action.data
        return u
      })
      return {...state, incidents}
    }

    case SEARCH_INCIDENT_DEVICES: {
      return {...state, incidentDevices: action.data}
    }

    case FIX_ALL_INCIDENTS_BY_TYPE:
      return { ...state, incidentDraw: state.incidentDraw + 1 }

    case UPDATE_SEARCH_PARAMS:
      return { ...state, params: action.params }

    case UPDATE_QUERY_PARAMS:
      return { ...state, queryParams: action.params }

    case UPDATE_SEARCH_FIELDS:
      return { ...state, fields: action.data.filter(k => k.count > 0) }
    case OPEN_FIELDS_POPOVER:
      return { ...state, fieldPopoverOpen: true, selectedField: action.selectedField, anchorEl: action.anchorEl }
    case CLOSE_FIELDS_POPOVER:
      return { ...state, fieldPopoverOpen: false }

    case FETCH_FIELD_TOP_VALUES:
      return { ...state, fieldTopValues: action.data }
    case UPDATE_QUERY_CHIPS:
      return { ...state, queryChips: action.chips }

    case FETCH_SEARCH_OPTIONS:
      return { ...state, searchOptions: action.data }
    case ADD_SEARCH_OPTION:
      return { ...state, searchOptions: concat([], state.searchOptions, action.option) }
    case UPDATE_SEARCH_OPTION:
      return { ...state, searchOptions: state.searchOptions.map(u => u.id === action.option.id ? action.option : u) }
    case REMOVE_SEARCH_OPTION:
      return { ...state, searchOptions: state.searchOptions.filter(u => u.id !== action.option.id) }

    case OPEN_SEARCH_SAVE_POPOVER:
      return { ...state, savePopoverOpen: true, selectedOption: action.option, anchorEl: action.anchorEl }
    case CLOSE_SEARCH_SAVE_POPOVER:
      return { ...state, savePopoverOpen: false }
    case CHANGE_SEARCH_SAVE_TYPE:
      return { ...state, searchSaveType: action.data }

    case OPEN_SEARCH_WF_MODAL:
      return { ...state, wfModalOpen: true, selectedRowWf: '' }
    case CLOSE_SEARCH_WF_MODAL:
      return { ...state, wfModalOpen: false }
    case SELECT_SEARCH_WF_CATEGORY:
      return { ...state, selectedCategory: action.categoryId, selectedRowWf: '' }
    case CHANGE_SEARCH_WF_FILTER:
      return { ...state, workflowFilter: action.filter, selectedRowWf: '' }
    case SELECT_WF_ROW:
      return { ...state, selectedRowWf: action.workflow }
    case SELECT_SEARCH_WF:
      return { ...state, selectedWf: action.workflow }
    case ADD_SEARCH_WF:
      return { ...state, selectedWfs: concat(state.selectedWfs, action.workflow) }
    case REMOVE_SEARCH_WF:
      return { ...state, selectedWfs: state.selectedWfs.filter(p => p.id !== action.workflow.id) }
    case REPLACE_SEARCH_WFS:
      return { ...state, selectedWfs: action.workflows || [] }
    case UPDATE_INCIDENTS_PARAMS:
      return { ...state, incidentParams: action.params }
    case SHOW_SAVED_SEARCH_MODAL:
      return { ...state, savedSearchModalOpen: !!action.visible }
    case UPDATE_SAVED_SEARCH_KEYWORD:
      return { ...state, savedSearchKeyword: action.keyword }
    case FETCH_SYS_SEARCH_OPTIONS:
      return { ...state, sysSearchOptions: action.data }
    case SELECT_SEARCH:
      return { ...state, selectedSearch: action.selected }
    case SET_LOADING_SEARCH_OPTIONS:
      return { ...state, loadingSearchOptions: action.loading }
    case SHOW_REL_DEVICES_POPOVER:
      return { ...state, relDevicePopoverOpen: !!action.visible, anchorEl: action.anchorEl }
    case FETCH_REL_DEVICES:
      return { ...state, relDevices: action.data }
    case SHOW_IRREL_DEVICES_MODAL:
      return { ...state, irrelDeviceModalOpen: !!action.visible }
    case FETCH_IRREL_DEVICES:
      return { ...state, irrelDevices: action.data }
    case SHOW_SEARCH_FIELDS_MODAL:
      return { ...state, searchFieldsModalOpen: !!action.visible, selectedSearchFields: action.visible ? state.searchFields : state.selectedSearchFields }
    case UPDATE_SELECTED_SEARCH_FIELDS:
      return { ...state, selectedSearchFields: action.fields }
    case UPDATE_REL_DEVICE_FIELDS:
      return { ...state, searchFields: action.fields }
    case SHARE_SAVED_SEARCH:
      return { ...state, shareSearchResult: action.data }
    case UPDATE_SEARCH_VIEW_FILTER:
      return { ...state, viewFilter: action.viewFilter }
    case SHOW_VIEW_FILTER_MODAL:
      return { ...state, viewFilterModalOpen: !!action.visible }
    case SELECT_VIEW_FILTER:
      return { ...state, selectedViewFilter: action.filter }
    case SHOW_SEARCH_GRAPH_MODAL:
      return { ...state, searchGraphModalOpen: !!action.visible, graphMaximized: true }
    case FETCH_SEARCH_RECORD_COUNT:
      return { ...state, searchRecordCounts: action.data }
    case MAXIMIZE_SEARCH_GRAPH:
      return { ...state, graphMaximized: action.maximize }
    case SHOW_SEARCH_TAG_MODAL:
      return { ...state, searchTagModalOpen: !!action.visible }
    case UPDATE_SEARCH_TAGS:
      return { ...state, searchTags: action.tags || [] }
    case UPDATE_GRAPH_PARAMS:
      return { ...state, graphParams: action.params }
    case REFRESH_SEARCH:
      return { ...state, searchDraw: state.searchDraw + 1 }
    case TOGGLE_VIEW_COL: {
      let {viewCols} = state
      if (viewCols.indexOf(action.col) >= 0) viewCols = viewCols.filter(p => p !== action.col)
      else viewCols = [ ...viewCols, action.col ]
      return { ...state, viewCols }
    }
    case RESET_VIEW_COLS:
      return { ...state, viewCols: action.cols || [] }
    case COLLAPSE_SEARCH_FIELDS:
      return { ...state, searchFieldsVisible: action.visible }
    case UPDATE_SEARCH_MONITOR:
      return { ...state, searchMonitorId: action.monitorId }
    case SHOW_SEARCH_MONITOR_MODAL:
      return { ...state, searchMonitorModalOpen: action.visible }
    default:
      return state
  }
}

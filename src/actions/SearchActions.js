import axios from 'axios'
import moment from 'moment'
import { assign } from 'lodash'
import {
  UPDATE_SEARCH_PARAMS,
  UPDATE_QUERY_PARAMS,
  UPDATE_SEARCH_FIELDS,
  OPEN_FIELDS_POPOVER,
  CLOSE_FIELDS_POPOVER,
  FETCH_FIELD_TOP_VALUES,
  UPDATE_QUERY_CHIPS,

  UPDATE_SEARCH_VIEW_FILTER,
  SHOW_VIEW_FILTER_MODAL,
  SELECT_VIEW_FILTER,

  UPDATE_INCIDENTS_PARAMS,

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

  UPDATE_USER_INFO,

  SHOW_SAVED_SEARCH_MODAL,
  UPDATE_SAVED_SEARCH_KEYWORD,
  FETCH_SYS_SEARCH_OPTIONS,
  SELECT_SEARCH,
  SET_LOADING_SEARCH_OPTIONS,
  SHOW_REL_DEVICES_POPOVER,
  FETCH_REL_DEVICES,
  SHOW_IRREL_DEVICES_MODAL,
  FETCH_IRREL_DEVICES,
  SHOW_SEARCH_FIELDS_MODAL,
  UPDATE_SELECTED_SEARCH_FIELDS,
  UPDATE_REL_DEVICE_FIELDS,
  REFRESH_SEARCH,
  UPDATE_SEARCH_MONITOR,
  SHOW_SEARCH_MONITOR_MODAL,

  SHARE_SAVED_SEARCH,

  SHOW_SEARCH_GRAPH_MODAL,
  FETCH_SEARCH_RECORD_COUNT,
  MAXIMIZE_SEARCH_GRAPH,

  UPDATE_GRAPH_PARAMS,

  TOGGLE_VIEW_COL,
  RESET_VIEW_COLS,
  COLLAPSE_SEARCH_FIELDS
} from './types'
import { ROOT_URL } from './config'
import { apiError } from './Errors'
import {dateFormat, parseSearchQuery} from 'shared/Global'

export const updateSearchParams = (params, history) => {
  return function (dispatch) {
    dispatch(fetchSearchFields(params))
    dispatch({
      type: UPDATE_SEARCH_PARAMS,
      params
    })
    history.replace({
      pathname: '/search',
      search: `?q=${encodeURIComponent(JSON.stringify(params))}`
    })
  }
}

export const updateQueryParams = (params, history) => {
  return dispatch => {
    dispatch({type: UPDATE_QUERY_PARAMS, params})
    history.replace({
      pathname: '/search',
      search: `?q=${encodeURIComponent(JSON.stringify(params))}`
    })
  }
}

export const fetchSearchFields = (params) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/search/fields`, {params}).then(res => {
      dispatch({type: UPDATE_SEARCH_FIELDS, data: res.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const openFieldsPopover = (selectedField, anchorEl) => {
  return dispatch => {
    dispatch({type: OPEN_FIELDS_POPOVER, selectedField, anchorEl})
  }
}

export const closeFieldsPopover = () => {
  return dispatch => {
    dispatch({type: CLOSE_FIELDS_POPOVER})
  }
}

export const fetchFieldTopValues = (name, params) => {
  return dispatch => {
    dispatch({type: FETCH_FIELD_TOP_VALUES, data: []})
    const config = {
      params: assign({}, params, {name})
    }
    axios.get(`${ROOT_URL}/search/topValueCount`, config).then(res => {
      dispatch({type: FETCH_FIELD_TOP_VALUES, data: res.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const updateQueryChips = (chips) => {
  return dispatch => {
    dispatch({type: UPDATE_QUERY_CHIPS, chips})
  }
}

const updateUserSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_USER_INFO,
    data: response.data
  })
}

export const addSearchOption = (user, option) => {
  if (!user) return
  return dispatch => {
    const searchOptions = JSON.parse(user.searchOptions || '[]')
    searchOptions.push(option)
    axios.put(user._links.self.href, assign({}, user, {
      searchOptions: JSON.stringify(searchOptions)
    })).then(res => updateUserSuccess(dispatch, res)).catch(error => apiError(dispatch, error))
  }
}

export const updateSearchOption = (user, option) => {
  if (!user) return
  return dispatch => {
    const searchOptions = JSON.parse(user.searchOptions || '[]')
    axios.put(user._links.self.href, assign({}, user, {
      searchOptions: JSON.stringify(searchOptions.map(m => m.id === option.id ? option : m))
    })).then(res => updateUserSuccess(dispatch, res)).catch(error => apiError(dispatch, error))
  }
}

export const removeSearchOption = (user, option) => {
  if (!user) return
  return dispatch => {
    const searchOptions = JSON.parse(user.searchOptions || '[]')
    axios.put(user._links.self.href, assign({}, user, {
      searchOptions: JSON.stringify(searchOptions.filter(m => m.id !== option.id))
    })).then(res => updateUserSuccess(dispatch, res)).catch(error => apiError(dispatch, error))
  }
}

export const openSearchSavePopover = (option, anchorEl) => {
  return dispatch => {
    dispatch({type: OPEN_SEARCH_SAVE_POPOVER, option, anchorEl})
  }
}

export const closeSearchSavePopover = () => {
  return dispatch => {
    dispatch({type: CLOSE_SEARCH_SAVE_POPOVER})
  }
}

export const changeSearchSaveType = (data) => {
  return dispatch => {
    dispatch({type: CHANGE_SEARCH_SAVE_TYPE, data})
  }
}

export const openSearchWfModal = () => {
  return dispatch => {
    dispatch({type: OPEN_SEARCH_WF_MODAL})
  }
}

export const closeSearchWfModal = () => {
  return dispatch => {
    dispatch({type: CLOSE_SEARCH_WF_MODAL})
  }
}

export const selectSearchWfCategory = (categoryId) => {
  return dispatch => {
    dispatch({type: SELECT_SEARCH_WF_CATEGORY, categoryId})
  }
}

export const changeSeachWfFilter = (filter) => {
  return dispatch => {
    dispatch({type: CHANGE_SEARCH_WF_FILTER, filter})
  }
}

export const selectWfRow = (workflow) => {
  return dispatch => {
    dispatch({type: SELECT_WF_ROW, workflow})
  }
}

export const selectSearchWf = (workflow) => {
  return dispatch => {
    dispatch({type: SELECT_SEARCH_WF, workflow})
  }
}

export const addSearchWf = (workflow) => {
  return dispatch => {
    dispatch({type: ADD_SEARCH_WF, workflow})
  }
}

export const removeSearchWf = (workflow) => {
  return dispatch => {
    dispatch({type: REMOVE_SEARCH_WF, workflow})
  }
}

export const replaceSearchWfs = (workflows) => {
  return dispatch => {
    dispatch({type: REPLACE_SEARCH_WFS, workflows})
  }
}

export const updateIncidentSearchParams = (params) => {
  return function (dispatch) {
    console.log(params)
    dispatch({
      type: UPDATE_INCIDENTS_PARAMS,
      params
    })
  }
}

export const showSavedSearch = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_SAVED_SEARCH_MODAL, visible})
  }
}

export const updateSavedSearchKeyword = (keyword) => {
  return dispatch => {
    dispatch({type: UPDATE_SAVED_SEARCH_KEYWORD, keyword})
  }
}

export const fetchSysSearchOptions = () => {
  return dispatch => {
    dispatch({type: SET_LOADING_SEARCH_OPTIONS, loading: true})
    axios.get(`${ROOT_URL}/usersearch?size=1000`).then(res => {
      dispatch({type: FETCH_SYS_SEARCH_OPTIONS, data: res.data._embedded.userSearches})
      dispatch({type: SET_LOADING_SEARCH_OPTIONS, loading: false})
    }).catch(error => apiError(dispatch, error))
  }
}

export function selectSearch (selected) {
  return dispatch => {
    dispatch({type: SELECT_SEARCH, selected})
  }
}

export const showRelDevicesPopover = (visible, anchorEl) => {
  return dispatch => {
    dispatch({type: SHOW_REL_DEVICES_POPOVER, visible, anchorEl})
  }
}

export const fetchRelDevices = (params, name) => {
  return dispatch => {
    dispatch({type: FETCH_REL_DEVICES, data: []})
    const config = {
      params: assign({}, params, { name, size: 10 })
    }
    axios.get(`${ROOT_URL}/search/topValueCount`, config).then(res => {
      dispatch({type: FETCH_REL_DEVICES, data: res.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const showIrrelDevicesModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_IRREL_DEVICES_MODAL, visible})
  }
}

export const fetchIrrelDevices = (params) => {
  return dispatch => {
    dispatch({type: FETCH_IRREL_DEVICES, data: []})
    const config = {
      params
    }
    axios.get(`${ROOT_URL}/search/irrelevantDevices`, config).then(res => {
      dispatch({type: FETCH_IRREL_DEVICES, data: res.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const showSearchFieldsModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_SEARCH_FIELDS_MODAL, visible})
  }
}

export const updateRelDeviceFields = (fields) => {
  return dispatch => {
    dispatch({type: UPDATE_REL_DEVICE_FIELDS, fields})
  }
}

export const updateSelectedSearchFields = (fields) => {
  return dispatch => {
    dispatch({type: UPDATE_SELECTED_SEARCH_FIELDS, fields})
  }
}

export const shareSavedSearch = (props) => {
  return dispatch => {
    dispatch({type: SHARE_SAVED_SEARCH, data: null})
    axios.post(`${ROOT_URL}/shareUserSearch`, props).then(({data}) => {
      if (data.success) dispatch({type: SHARE_SAVED_SEARCH, data: 'OK'})
      else dispatch({type: SHARE_SAVED_SEARCH, data: 'Error'})
    }).catch(error => apiError(dispatch, error))
  }
}

export const updateSearchViewFilter = (viewFilter) => {
  return dispatch => {
    dispatch({type: UPDATE_SEARCH_VIEW_FILTER, viewFilter})
  }
}

export const showViewFilterModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_VIEW_FILTER_MODAL, visible})
  }
}

export const selectViewFilter = (filter) => {
  return dispatch => {
    dispatch({type: SELECT_VIEW_FILTER, filter})
  }
}

export const showSearchGraphModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_SEARCH_GRAPH_MODAL, visible})
  }
}

export const fetchSearchRecordCount = (params) => {
  return dispatch => {
    dispatch({type: FETCH_SEARCH_RECORD_COUNT, data: null})
    const config = {
      params
    }
    axios.get(`${ROOT_URL}/search/getRecordCount`, config).then(res => {
      dispatch({type: FETCH_SEARCH_RECORD_COUNT, data: res.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const maximizeSearchGraph = (maximize) => {
  return dispatch => {
    dispatch({type: MAXIMIZE_SEARCH_GRAPH, maximize})
  }
}

export const showSearchTagModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_SEARCH_TAG_MODAL, visible})
  }
}

export const updateSearchTags = (tags) => {
  return dispatch => {
    dispatch({type: UPDATE_SEARCH_TAGS, tags})
  }
}

export const updateGraphParams = (params, graphParams) => {
  return dispatch => {
    dispatch({type: UPDATE_GRAPH_PARAMS, params: graphParams})
    dispatch(fetchSearchRecordCount({...params, ...graphParams}))
  }
}

export const toggleViewCol = (col) => {
  return dispatch => {
    dispatch({type: TOGGLE_VIEW_COL, col})
  }
}

export const resetViewCols = (cols) => {
  return dispatch => {
    dispatch({type: RESET_VIEW_COLS, cols})
  }
}

export const refreshSearch = () => {
  return dispatch => {
    dispatch({type: REFRESH_SEARCH})
  }
}

export const updateSearchMonitor = (monitorId) => {
  return dispatch => {
    dispatch({type: UPDATE_SEARCH_MONITOR, monitorId})
  }
}

export const collapseSearchFields = (visible) => {
  return dispatch => {
    dispatch({type: COLLAPSE_SEARCH_FIELDS, visible})
  }
}

export const loadSearch = (data, history) => {
  return dispatch => {
    const query = data.query || ''
    const workflow = data.workflow || ''
    const tag = data.tag || ''
    const collections = data.collections || 'incident,event'
    const severity = data.severity || 'HIGH,MEDIUM'
    const monitorTypes = data.monitorTypes || ''
    const dateFrom = data.dateFrom || moment().add(-1, 'days').startOf('day').format(dateFormat)
    const dateTo = data.dateTo || moment().endOf('day').format(dateFormat)

    const params = {
      query,
      workflow,
      tag,
      collections,
      severity,
      monitorTypes,
      dateFrom,
      dateTo
    }

    const queryChips = parseSearchQuery(query)
    const tags = tag.split(',').filter(p => !!p)

    dispatch(updateQueryChips(queryChips))
    dispatch(updateSearchTags(tags))
    dispatch(replaceSearchWfs([]))
    dispatch(updateSearchViewFilter(''))
    dispatch(resetViewCols())
    dispatch(updateSearchMonitor(''))
    dispatch(updateSearchParams(params, history))
  }
}

export const showSearchMonitorModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_SEARCH_MONITOR_MODAL, visible})
  }
}

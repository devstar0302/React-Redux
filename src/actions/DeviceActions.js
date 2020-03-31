import axios from 'axios'
import {assign, findIndex} from 'lodash'
import {
  FETCH_DEVICES,
  FETCH_DEVICES_GROUPS,

  OPEN_DEVICE,
  CLOSE_DEVICE,

  OPEN_DEVICE_MONITOR_PICKER,
  CLOSE_DEVICE_MONITOR_PICKER,

  OPEN_DEVICE_MONITOR_WIZARD,
  CLOSE_DEVICE_MONITOR_WIZARD,
  CLEAR_DEVICE_WIZARD_INITIAL_VALUES,
  SHOW_MONITOR_TAG_MODAL,
  UPDATE_MONITOR_TAGS,

  OPEN_PARAMS_MODAL,
  CLOSE_PARAMS_MODAL,
  OPEN_PARAM_EDIT_MODAL,
  CLOSE_PARAM_EDIT_MODAL,
  ADD_PARAM,
  UPDATE_PARAM,
  REMOVE_PARAM,
  UPDATE_MONITOR_PARAMS,

  FETCH_DEVICE_WORKFLOWS,
  OPEN_DEVICE_WORKFLOW_MODAL,
  CLOSE_DEVICE_WORKFLOW_MODAL,
  ADD_DEVICE_WORKFLOW,
  UPDATE_DEVICE_WORKFLOW,
  REMOVE_DEVICE_WORKFLOW,
  FETCH_DEVICE_EVENTS,
  FETCH_DEVICE_PHYSICAL_RULES,
  FETCH_DEVICE_BASIC_MONITORS,
  FETCH_DEVICE_EVENTLOG,
  FETCH_DEVICE_APPS,
  SHOW_DEVICE_CPU_PROCESS_MODAL,
  SHOW_DEVICE_MEMORY_PROCESS_MODAL,

  OPEN_SYS_WORKFLOWS_MODAL,
  CLOSE_SYS_WORKFLOWS_MODAL,
  SELECT_SYS_WORKFLOW,
  DESELECT_SYS_WORKFLOW,
  SELECT_SYS_WORKFLOW_CATEGORY,

  OPEN_DEVICE_EDIT_MODAL,
  CLOSE_DEVICE_EDIT_MODAL,

  FETCH_DEVICE_TEMPLATES,
  ADD_DEVICE_TEMPLATE,
  UPDATE_DEVICE_TEMPLATE,
  DELETE_DEVICE_TEMPLATE,
  OPEN_DEVICE_TEMPLATE_MODAL,
  CLOSE_DEVICE_TEMPLATE_MODAL,

  OPEN_DEVICE_RULE_MODAL,
  CLOSE_DEVICE_RULE_MODAL,

  FETCH_WORKFLOW_CATEGORIES,
  SELECT_WORKFLOW_CATEGORY,
  OPEN_WF_CATEGORY_MODAL,
  CLOSE_WF_CATEGORY_MODAL,
  ADD_WF_CATEGORY,
  OPEN_DEVICE_WF_DIAGRAM_MODAL,
  CLOSE_DEVICE_WF_DIAGRAM_MODAL,

  OPEN_WF_ACTION_MODAL,
  CLOSE_WF_ACTION_MODAL,

  UPDATE_MAP_DEVICE,

  FIX_ALL_DEVICE_INCIDENTS,

  FETCH_GROUP_DEVICES_LINES,
  ADD_GROUP_DEVICE,
  UPDATE_GROUP_DEVICE,
  REMOVE_GROUP_DEVICE,
  ADD_GROUP_LINE,
  UPDATE_GROUP_LINE,
  REMOVE_GROUP_LINE,

  FETCH_DEVICE_PROCESS,
  OPEN_PROCESS_MODAL,
  CLOSE_PROCESS_MODAL,

  FETCH_MONITOR_OS,
  FETCH_MONITOR_DISK,
  FETCH_MONITOR_CPU,
  FETCH_MONITOR_MEMORY,
  UPDATE_MONITOR_REALTIME,
  CLEAR_MONITORS,
  SHOW_LOCAL_USER_MODAL,
  SELECT_LOGNAME,
  SHOW_FW_RULE_MODAL,

  SHOW_MONITOR_HISTORY_MODAL,

  SHOW_DEVICE_TAG_MODAL,
  UPDATE_DEVICE_TAGS,

  UPDATE_DEVICE_CREDS,
  SHOW_DEVICE_CREDS_PICKER,
  SELECT_DEVICE_CREDS,

  UPDATE_MONITOR_QUERY,
  UPDATE_DEVICE_APP_TAB,

  ADD_AGENT_INSTALL,
  UPDATE_AGENT_INSTALL,
  CLEAR_AGENT_INSTALL,
  UPDATE_INSTALL_AGENT_MESSAGE,

  NO_AUTH_ERROR
} from './types'

import { apiError, updateDeviceError } from './Errors'
import { ROOT_URL } from './config'
import { encodeUrlParams, filterDevices } from 'shared/Global'
import { getAuthConfig, getWorkflowConfig } from './util'

export const fetchDevice = (id) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/device/${id}`, getAuthConfig())
      .then(response => dispatch(fetchDeviceSuccess(response)))
      .catch(() => {
        axios.get(`${ROOT_URL}/group/${id}`, getAuthConfig())
          .then(response => dispatch(fetchDeviceSuccess(response)))
          .catch(error => apiError(dispatch, error))
      })
  }
}

const fetchDeviceSuccess = (response) => {
  return dispatch => {
    dispatch({type: FETCH_DEVICES, payload: [response.data]})
  }
}

export const fetchDevices = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/device?size=1000`, getAuthConfig())
      .then(response => fetchDevicesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDevicesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICES,
    payload: response.data._embedded.devices
  })
}

export const fetchDevicesGroups = () => {
  return dispatch => {
    const reqs = []
    reqs.push(axios.get(`${ROOT_URL}/device?size=1000`))
    reqs.push(axios.get(`${ROOT_URL}/group?size=1000`))

    axios.all(reqs).then(res => {
      const data = [...filterDevices(res[0].data._embedded.devices), ...res[1].data._embedded.groups]
      dispatch({type: FETCH_DEVICES_GROUPS, data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const openDevice = (device) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE,
      data: device
    })
  }
}

export const closeDevice = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE
    })
  }
}

export const openDeviceMonitorPicker = () => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_MONITOR_PICKER
    })
  }
}

export const closeDeviceMonitorPicker = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_MONITOR_PICKER
    })
  }
}

export const openDeviceMonitorWizard = (initialValues, monitorConfig) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_MONITOR_WIZARD,
      data: initialValues,
      monitorConfig
    })
  }
}

export const closeDeviceMonitorWizard = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_MONITOR_WIZARD
    })
  }
}

export const clearDeviceWizardInitialValues = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_DEVICE_WIZARD_INITIAL_VALUES
    })
  }
}

export function openParamsModal (params) {
  return dispatch => {
    dispatch({type: OPEN_PARAMS_MODAL, params})
  }
}

export function closeParamsModal () {
  return dispatch => {
    dispatch({type: CLOSE_PARAMS_MODAL})
  }
}

export function openParamEditModal (param) {
  return dispatch => {
    dispatch({type: OPEN_PARAM_EDIT_MODAL, param})
  }
}

export function closeParamEditModal () {
  return dispatch => {
    dispatch({type: CLOSE_PARAM_EDIT_MODAL})
  }
}

export function addParam (param) {
  return dispatch => {
    dispatch({type: ADD_PARAM, param})
    dispatch(closeParamEditModal())
  }
}

export function updateParam (oldParam, newParam) {
  return dispatch => {
    dispatch({type: UPDATE_PARAM, oldParam, newParam})
    dispatch(closeParamEditModal())
  }
}

export function removeParam (param) {
  return dispatch => {
    dispatch({type: REMOVE_PARAM, param})
  }
}

export function updateMonitorParams (params) {
  return dispatch => {
    dispatch({type: UPDATE_MONITOR_PARAMS, params})
    dispatch(closeParamsModal())
  }
}

export const fetchDeviceWorkflows = (params) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/workflow/search/findById?${encodeUrlParams(params)}`, getWorkflowConfig())
      .then((response) => fetchDeviceWorkflowsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceWorkflowsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_WORKFLOWS,
    data: response.data._embedded.workflows
  })
}

export const addDeviceWorkflow = (props, device, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/workflow`, props).then(response => {
      addDeviceWorkflowSuccess(dispatch, [response], device, cb)
    })
      .catch(error => apiError(dispatch, error))
  }
}

export const addDeviceWorkflows = (workflows, device) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    const reqs = []
    workflows.forEach(props => {
      reqs.push(axios.post(`${ROOT_URL}/workflow`, props))
    })

    axios.all(reqs)
      .then(responses => addDeviceWorkflowSuccess(dispatch, responses, device))
      .catch(error => apiError(dispatch, error))
  }
}

const addDeviceWorkflowSuccess = (dispatch, responses, device, cb) => {
  if (!device.workflowids) device.workflowids = []
  responses.forEach(response => device.workflowids.push(response.data.id))

  axios.put(device._links.self.href, device)
    .then(response2 => {
      dispatch({
        type: ADD_DEVICE_WORKFLOW,
        data: responses.map(r => r.data)
      })
      dispatch(closeDeviceWorkflowModal())
      dispatch(closeSysWorkflowsModal())
      cb && cb(responses[0].data)
    })
    .catch(error => updateDeviceError(dispatch, error))
}

export const updateDeviceWorkflow = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateDeviceWorkflowSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateDeviceWorkflowSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_DEVICE_WORKFLOW,
    data: response.data
  })
  dispatch(closeDeviceWorkflowModal())
}

export const removeDeviceWorkflow = (entity, device) => {
  return dispatch => {
    axios.delete(entity._links.self.href)
      .then(() => removeDeviceWorkflowSuccess(dispatch, entity, device))
      .catch(error => apiError(dispatch, error))
  }
}

const removeDeviceWorkflowSuccess = (dispatch, entity, device) => {
  if (!device.workflowids) device.workflowids = []
  const index = device.workflowids.indexOf(entity.id)
  device.workflowids.splice(index, 1)

  axios.put(device._links.self.href, device)
    .then(response => {
      dispatch({
        type: REMOVE_DEVICE_WORKFLOW,
        data: entity
      })
    })
    .catch(error => updateDeviceError(dispatch, error))
}

export const openDeviceWorkflowModal = (entity) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_WORKFLOW_MODAL,
      data: entity
    })
  }
}

export const closeDeviceWorkflowModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_WORKFLOW_MODAL
    })
  }
}

export const openDeviceWfDiagramModal = (diagram) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_WF_DIAGRAM_MODAL,
      data: diagram
    })
  }
}

export const closeDeviceWfDiagramModal = (dispatch) => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_WF_DIAGRAM_MODAL
    })
  }
}

export const fetchDeviceEvents = (deviceid) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/event/search/findBy`, {
      params: {
        deviceid
      }
    })
      .then((response) => fetchDeviceEventsSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceEventsSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_EVENTS,
    data: response.data._embedded.events
  })
}

export const fetchDevicePhysicalRules = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_PHYSICAL_RULES,
      data: []
    })
  }
}

export const fetchDeviceBasicMonitors = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_BASIC_MONITORS,
      data: []
    })
  }
}

export const fetchDeviceEventLog = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_EVENTLOG,
      data: []
    })
  }
}

export const fetchDeviceApps = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_DEVICE_APPS,
      data: []
    })
  }
}

export const showDeviceCpuProcessModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_DEVICE_CPU_PROCESS_MODAL, visible})
  }
}

export const showDeviceMemoryProcessModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_DEVICE_MEMORY_PROCESS_MODAL, visible})
  }
}

export const openDeviceEditModal = (device) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_EDIT_MODAL,
      device
    })
  }
}

export const closeDeviceEditModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_EDIT_MODAL
    })
  }
}

export const addDevice = (url, props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(url, props)
      .then(() => addDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const addDeviceSuccess = (dispatch) => {
  dispatch(closeDeviceEditModal())
  dispatch(fetchDevices())
}

export const updateDevice = (url, props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(url, props)
      .then(response => updateDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const updateDeviceSuccess = (dispatch) => {
  dispatch(closeDeviceEditModal())
  dispatch(fetchDevices())
}

export const deleteDevice = (url) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(url)
      .then(() => deleteDeviceSuccess(dispatch))
      .catch(error => updateDeviceError(dispatch, error))
  }
}

const deleteDeviceSuccess = (dispatch) => {
  dispatch(fetchDevices())
}

export const fetchDeviceTemplates = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/devicetemplate?size=1000&sort=order`)
      .then(response => fetchDeviceTemplatesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchDeviceTemplatesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_DEVICE_TEMPLATES,
    data: response.data._embedded.deviceTemplates
  })
}

export const addDeviceTemplate = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/devicetemplate`, props)
      .then(response => addDeviceTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addDeviceTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: ADD_DEVICE_TEMPLATE,
    data: response.data
  })
  dispatch(closeDeviceTplModal())
}

export const updateDeviceTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity)
      .then(response => updateDeviceTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const updateDeviceTemplateSuccess = (dispatch, response) => {
  dispatch({
    type: UPDATE_DEVICE_TEMPLATE,
    data: response.data
  })
  dispatch(closeDeviceTplModal())
}

export const deleteDeviceTemplate = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href, entity)
      .then(() => deleteDeviceTemplateSuccess(dispatch, entity))
      .catch(error => apiError(dispatch, error))
  }
}

const deleteDeviceTemplateSuccess = (dispatch, entity) => {
  dispatch({
    type: DELETE_DEVICE_TEMPLATE,
    data: entity
  })
}

export const cloneDeviceTemplate = (entity) => {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/devicetemplate`, {
      ...entity,
      id: null,
      origin: 'USER'
    })
      .then(response => addDeviceTemplateSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

export const openDeviceTplModal = (tpl) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_TEMPLATE_MODAL,
      data: tpl
    })
  }
}

export const closeDeviceTplModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_TEMPLATE_MODAL
    })
  }
}

export const openDeviceRuleModal = (rule) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_DEVICE_RULE_MODAL,
      data: rule
    })
  }
}

export const closeDeviceRuleModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_DEVICE_RULE_MODAL
    })
  }
}

export const fetchWorkflowCategories = () => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.get(`${ROOT_URL}/tag`)
      .then((response) => fetchWorkflowCategoriesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchWorkflowCategoriesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_WORKFLOW_CATEGORIES,
    data: response.data._embedded.tags
  })
}

export const selectWorkflowCategory = (category) => {
  return dispatch => {
    dispatch({type: SELECT_WORKFLOW_CATEGORY, category})
  }
}

export const openWfCategoryModal = (rule) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_WF_CATEGORY_MODAL,
      data: rule
    })
  }
}

export const closeWfCategoryModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_WF_CATEGORY_MODAL
    })
  }
}

export const addWfCategory = (props) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/workflowcategory`, props)
      .then(response => addWfCategorySuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const addWfCategorySuccess = (dispatch, response) => {
  dispatch({
    type: ADD_WF_CATEGORY,
    data: response.data
  })
  dispatch(closeWfCategoryModal())
}

export const openWfActionModal = (action) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_WF_ACTION_MODAL,
      data: action
    })
  }
}

export const closeWfActionModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_WF_ACTION_MODAL
    })
  }
}

export const fixAllDeviceIncidents = (device, user, text) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/incident/fixall/bydeviceid/${device.id}/${user}/${encodeURIComponent(text)}`).then(res => {
      dispatch({type: FIX_ALL_DEVICE_INCIDENTS})
    }).catch(error => apiError(dispatch, error))
  }
}

export const fixDeviceIncidents = (incidentIds, user, text) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/incident/fixall/selected/${incidentIds.join(',')}/${user}/${encodeURIComponent(text)}`).then(res => {
      dispatch({type: FIX_ALL_DEVICE_INCIDENTS})
    }).catch(error => apiError(dispatch, error))
  }
}

export const fetchGroupDevicesAndLines = (groupid) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }

  return (dispatch) => {
    dispatch({
      type: FETCH_GROUP_DEVICES_LINES,
      devices: [],
      lines: []
    })

    const req1 = axios.get(`${ROOT_URL}/device/search/findDevicesByGroupid`, {params: {groupid}})
      .then(response => {
        return response.data._embedded.devices
      })

    const req2 = axios.get(`${ROOT_URL}/device/search/findLinesByGroupid`, {params: {groupid}})
      .then(response => {
        return response.data._embedded.devices
      })

    axios.all([req1, req2])
      .then(response => fetchGroupDevicesAndLinesSuccess(dispatch, response))
      .catch(error => apiError(dispatch, error))
  }
}

const fetchGroupDevicesAndLinesSuccess = (dispatch, response) => {
  dispatch({
    type: FETCH_GROUP_DEVICES_LINES,
    devices: response[0],
    lines: response[1]
  })
}

export const fetchDeviceProcesses = (device) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/event/search/findAgentEvents`, {
      params: {
        deviceid: device.id,
        eventType: 'AGENT',
        monitortype: 'process',
        sort: 'timestamp,desc',
        size: 1
      }
    }).then(res => {
      const {events} = res.data._embedded
      const event = events.length ? events[0] : null
      const data = event ? event.dataobj.map((u, i) => assign(u, {id: i, timestamp: event.timestamp})) : []
      dispatch({type: FETCH_DEVICE_PROCESS, data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const openProcessModal = (process) => {
  return dispatch => {
    dispatch({type: OPEN_PROCESS_MODAL, process})
  }
}

export const closeProcessModal = () => {
  return dispatch => {
    dispatch({type: CLOSE_PROCESS_MODAL})
  }
}

export const addGroupDevice = (props, url, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}${url || '/device'}`, props).then(response => {
      dispatch({type: ADD_GROUP_DEVICE, data: response.data})
      cb && cb(response.data)
    }).catch(error => apiError(dispatch, error))
  }
}

export const updateGroupDevice = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity).then(response => {
      dispatch({type: UPDATE_GROUP_DEVICE, data: response.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const removeGroupDevice = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href).then(() => {
      dispatch({type: REMOVE_GROUP_DEVICE, data: entity})
    }).catch(error => apiError(dispatch, error))
  }
}

export const addGroupLine = (props, cb) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.post(`${ROOT_URL}/device`, props).then(response => {
      dispatch({type: ADD_GROUP_LINE, data: response.data})
      cb && cb(response.data)
    }).catch(error => apiError(dispatch, error))
  }
}

export const updateGroupLine = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.put(entity._links.self.href, entity).then(response => {
      dispatch({type: UPDATE_GROUP_LINE, data: response.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const removeGroupLine = (entity) => {
  if (!window.localStorage.getItem('token')) {
    return dispatch => dispatch({ type: NO_AUTH_ERROR })
  }
  return (dispatch) => {
    axios.delete(entity._links.self.href).then(() => {
      dispatch({type: REMOVE_GROUP_LINE, data: entity})
    }).catch(error => apiError(dispatch, error))
  }
}

export const addDeviceGauge = (props, group) => {
  return dispatch => {
    dispatch(updateMapDevice({
      ...group,
      gauges: [...(group.gauges || []), props]
    }))
  }
}

export const updateDeviceGauge = (props, group) => {
  return dispatch => {
    const gauges = (group.gauges || []).map(p => {
      if (props.length) {
        const index = findIndex(props, {id: p.id})
        return index < 0 ? p : props[index]
      } else {
        return p.id === props.id ? props : p
      }
    })
    dispatch(updateMapDevice({
      ...group,
      gauges
    }))
  }
}

export const removeDeviceGauge = (props, group) => {
  return dispatch => {
    dispatch(updateMapDevice({
      ...group,
      gauges: (group.gauges || []).filter(p => p.id !== props.id)
    }))
  }
}

const updateMapDevice = (entity) => {
  return dispatch => {
    axios.put(entity._links.self.href, entity).then(response => {
      dispatch({type: UPDATE_MAP_DEVICE, data: response.data})
    }).catch(error => apiError(dispatch, error))
  }
}

export const openSysWorkflowsModal = () => {
  return dispatch => {
    dispatch({type: OPEN_SYS_WORKFLOWS_MODAL})
  }
}

export const closeSysWorkflowsModal = () => {
  return dispatch => {
    dispatch({type: CLOSE_SYS_WORKFLOWS_MODAL})
  }
}

export const selectSysWorkflow = (workflow) => {
  return dispatch => {
    dispatch({type: SELECT_SYS_WORKFLOW, workflow})
  }
}

export const deselectSysWorkflow = (workflow) => {
  return dispatch => {
    dispatch({type: DESELECT_SYS_WORKFLOW, workflow})
  }
}

export const selectSysWorkflowCategory = (category) => {
  return dispatch => {
    dispatch({type: SELECT_SYS_WORKFLOW_CATEGORY, category})
  }
}

const fetchAgentEvent = (dispatch, deviceid, monitortype, cb) => {
  axios.get(`${ROOT_URL}/event/search/findAgentEvents`, {
    params: {
      deviceid,
      eventType: 'AGENT',
      monitortype,
      sort: 'timestamp,desc',
      size: 1
    }
  }).then(res => {
    const data = res.data._embedded.events
    data && data.length && cb && cb(data[0])
  }).catch(error => apiError(dispatch, error))
}

export const fetchMonitorOS = (deviceid) => {
  return dispatch => {
    fetchAgentEvent(dispatch, deviceid, 'os', data => {
      dispatch({type: FETCH_MONITOR_OS, os: data})
    })
  }
}

export const fetchMonitorDisk = (deviceid) => {
  return dispatch => {
    fetchAgentEvent(dispatch, deviceid, 'disk', data => {
      dispatch({type: FETCH_MONITOR_DISK, disk: data})
    })
  }
}

export const fetchMonitorCpu = (deviceid) => {
  return dispatch => {
    fetchAgentEvent(dispatch, deviceid, 'cpu', data => {
      dispatch({type: FETCH_MONITOR_CPU, cpu: data})
    })
  }
}

export const fetchMonitorMemory = (deviceid) => {
  return dispatch => {
    fetchAgentEvent(dispatch, deviceid, 'memory', data => {
      dispatch({type: FETCH_MONITOR_MEMORY, memory: data})
    })
  }
}

export const clearMonitors = () => {
  return dispatch => {
    dispatch({type: CLEAR_MONITORS})
  }
}

export const updateMonitorRealTime = (data) => {
  return dispatch => {
    dispatch({type: UPDATE_MONITOR_REALTIME, data})
  }
}

export const showLocalUserModal = (visible) => {
  return dispatch => {
    dispatch({type: SHOW_LOCAL_USER_MODAL, visible})
  }
}

export function selectLogName (logName) {
  return dispatch => {
    dispatch({type: SELECT_LOGNAME, logName})
  }
}

export function showFwRuleModal (visible) {
  return dispatch => {
    dispatch({type: SHOW_FW_RULE_MODAL, visible})
  }
}

export function showMonitorHistoryModal (visible, monitor) {
  return dispatch => {
    dispatch({type: SHOW_MONITOR_HISTORY_MODAL, visible, monitor})
  }
}

export function showMonitorTagModal (visible) {
  return dispatch => {
    dispatch({type: SHOW_MONITOR_TAG_MODAL, visible})
  }
}

export function updateMonitorTags (tags) {
  return dispatch => {
    dispatch({type: UPDATE_MONITOR_TAGS, tags})
  }
}

export function showDeviceTagModal (visible) {
  return dispatch => {
    dispatch({type: SHOW_DEVICE_TAG_MODAL, visible})
  }
}

export function updateDeviceTags (tags) {
  return dispatch => {
    dispatch({type: UPDATE_DEVICE_TAGS, tags})
  }
}

export function updateMonitorQuery (query) {
  return dispatch => {
    dispatch({type: UPDATE_MONITOR_QUERY, query})
  }
}

export function updateDeviceAppTab (tab) {
  return dispatch => {
    dispatch({type: UPDATE_DEVICE_APP_TAB, tab})
  }
}

export function updateDeviceCreds (creds) {
  return dispatch => {
    dispatch({type: UPDATE_DEVICE_CREDS, creds})
  }
}

export function showDeviceCredsPicker (visible) {
  return dispatch => {
    dispatch({type: SHOW_DEVICE_CREDS_PICKER, visible})
  }
}

export function selectDeviceCreds (creds) {
  return dispatch => {
    dispatch({type: SELECT_DEVICE_CREDS, creds})
  }
}

export function installAgent (device) {
  return dispatch => {
    dispatch({type: ADD_AGENT_INSTALL, data: device})
    dispatch({type: UPDATE_INSTALL_AGENT_MESSAGE, data: ''})
    axios.get(`${ROOT_URL}/installAgent`, {
      params: {
          id: device.id
      }
    }).then(({data})=> {
      if (!data.success) dispatch({type: UPDATE_AGENT_INSTALL, data: device, status: 'failed'})
      dispatch({type: UPDATE_INSTALL_AGENT_MESSAGE, data: data.success ? 'Successfully installed.' : data.info})
    }).catch(() => {
      dispatch({type: UPDATE_AGENT_INSTALL, data: device, status: 'failed'})
    })
  }
}

export function uninstallAgent (device) {
  return dispatch => {
    axios.get(`${ROOT_URL}/uninstallAgent`, {
      params: {
        id: device.id
      }
    })
  }
}

export function clearAgentInstall () {
  return dispatch => {
    dispatch({type: CLEAR_AGENT_INSTALL})
  }
}

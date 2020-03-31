import axios from 'axios'
import { ROOT_URL } from './config'
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
  FETCH_PARSERTYPE_BY_TAGS,

  API_ERROR
} from './types'

import {encodeUrlParams} from 'shared/Global'

export function showTagModal (visible, tag) {
  return dispatch => {
    dispatch({type: SHOW_TAG_MODAL, visible, tag})
  }
}

export function fetchTags () {
  return dispatch => {
    axios.get(`${ROOT_URL}/tag?size=1000`).then(res => {
      dispatch({type: FETCH_TAGS, data: res.data._embedded.tags})
    })
  }
}

export function addTag (props) {
  return dispatch => {
    axios.post(`${ROOT_URL}/tag`, props).then(res => {
      dispatch({type: ADD_TAG, data: res.data})
      dispatch(showTagModal(false))
    })
  }
}

export function updateTag (entity) {
  return dispatch => {
    axios.put(entity._links.self.href, entity).then(({data}) => {
      dispatch({type: UPDATE_TAG, data})
      dispatch(showTagModal(false))
    }).catch(error => {
      dispatch({type: API_ERROR, msg: error})
    })
  }
}

export function removeTag (entity) {
  return (dispatch) => {
    axios.delete(entity._links.self.href).then(() => {
      dispatch({type: REMOVE_TAG, data: entity})
    }).catch(error => {
      dispatch({type: API_ERROR, msg: error})
    })
  }
}

export function selectTag (tags) {
  return dispatch => {
    dispatch({type: SELECT_TAG, tags})
  }
}

export function multiSelectTag (tags) {
  return dispatch => {
    dispatch({type: MULTI_SELECT_TAG, tags})
  }
}

export function fetchItemsByTags (tags) {
  return dispatch => {
    if (tags.length) {
      const params = encodeUrlParams({tag: tags.map(t => t.name)})
      axios.get(`${ROOT_URL}/device/search/findByTagsIn?${params}`).then(res => {
        dispatch({type: FETCH_DEVICE_BY_TAGS, data: res.data._embedded.devices})
      })
      axios.get(`${ROOT_URL}/workflow/search/findByTagsIn?${params}`).then(res => {
        dispatch({type: FETCH_WORKFLOW_BY_TAGS, data: res.data._embedded.workflows})
      })
      axios.get(`${ROOT_URL}/devicetemplate/search/findByTagsIn?${params}`).then(res => {
        dispatch({type: FETCH_DEVICETPL_BY_TAGS, data: res.data._embedded.deviceTemplates})
      })
      axios.get(`${ROOT_URL}/monitortemplate/search/findByTagsIn?${params}`).then(res => {
        dispatch({type: FETCH_MONITORTPL_BY_TAGS, data: res.data._embedded.monitorTemplates})
      })
      axios.get(`${ROOT_URL}/parsertype/search/findByTagsIn?${params}`).then(res => {
        dispatch({type: FETCH_PARSERTYPE_BY_TAGS, data: res.data._embedded.parserTypes})
      })
    } else {
      dispatch({type: FETCH_DEVICE_BY_TAGS, data: []})
      dispatch({type: FETCH_WORKFLOW_BY_TAGS, data: []})
      dispatch({type: FETCH_DEVICETPL_BY_TAGS, data: []})
      dispatch({type: FETCH_MONITORTPL_BY_TAGS, data: []})
      dispatch({type: FETCH_PARSERTYPE_BY_TAGS, data: []})
    }
  }
}

import moment from 'moment'
import React from 'react'
import {reduce, isNull, isUndefined, isArray, assign} from 'lodash'
import { ROOT_URL } from 'actions/config'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import DescriptionIcon from 'material-ui/svg-icons/action/description'
import { iconStyle } from 'style/common/materialStyles'

export const dateFormat = 'DD/MM/YYYY HH:mm:ss'
export const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss'

export const queryDateFormat = 'YYYY-MM-DD HH:mm:ss'

export const extImageBaseUrl = `${ROOT_URL}/externalpictures?name=`
export function getCustomImageUrl (img) {
  return `data:${img.mimeType};base64,${img.content}`
}

export const cybertronUrl = 'http://www.cyber-security.io'

export function isGroup (device) {
  return device && device.groupid === undefined
}

export const DragTypes = {
  DEVICE: 'device',
  DIVIDER: 'divider',
  WORKFLOW: 'workflow'
}

export const DiagramTypes = {
  OBJECT: 'object',
  LINE: 'line'
}

export const lineTypes = [{
  title: 'Lightning',
  image: '/resources/images/dashboard/map/light.svg',
  type: 'lightning'
}, {
  title: 'Lightning',
  image: '/resources/images/dashboard/map/lightning2.png',
  type: 'lightning2',
  visible: true
}, {
  title: 'Line',
  image: '/resources/images/dashboard/map/line.gif',
  type: 'normal',
  visible: true
}, {
  title: 'Dashed Line',
  image: '/resources/images/dashboard/map/dashedline.png',
  type: 'dashed',
  visible: true
}]

export function getSeverityIcon (severity) {
  switch ((severity || '').toLowerCase()) {
    case 'high':
      return <WarningIcon style={iconStyle} color="#e13e3e" data-tip={severity}/>
    case 'low':
      return <WarningIcon style={iconStyle} color="#ef9f15" data-tip={severity}/>
    case 'medium':
      return <WarningIcon style={iconStyle} color="#52a1be" data-tip={severity}/>
    default:
      return <DescriptionIcon style={iconStyle} color="#52a1be" data-tip={severity}/>
  }
}

export function dateFormatter (datetime) {
  let date = datetime.substring(0, 10)
  let time = datetime.substring(11, 16)
  let today = moment().format('YYYY-MM-DD')
  if (today === date) return `Today ${time}`

  let yesterday = moment(new Date(new Date() - 3600 * 24 * 1000)).format('YYYY-MM-DD')
  if (yesterday === date) return `Yesterday ${time}`

  let diff = new Date() - new Date(date)
  if (diff <= 0) return 'Today'

  let seconds = diff / 1000
  let minutes = seconds / 60
  let hours = minutes / 60
  let days = Math.floor(hours / 24)
  let years = Math.floor(days / 365)

  let str = ''
  if (years > 0) {
    days -= years * 365
    str += `${years} year${years > 1 ? 's' : ''}`
  }

  let months = Math.floor(days / 30)
  if (months > 0) {
    days -= months * 30
    if (str) str += ' '
    str += `${months} month${months > 1 ? 's' : ''}`
  }

  if (days > 0) {
    if (str) str += ' '
    str += `${days} day${days > 1 ? 's' : ''}`
  }

  if (str) str += ' ago'
  str += ` ${time}`

  return str
}

export function format () {
  let args = arguments
  return args[0].replace(/{(\d+)}/g, function (match, number) {
    return typeof args[1 + parseInt(number, 10)] !== 'undefined' ? args[1 + parseInt(number, 10)] : match
  })
}

export function encodeUrlParams (obj) {
  let qs = reduce(obj, function (result, value, key) {
    if (!isNull(value) && !isUndefined(value)) {
      if (isArray(value)) {
        result += reduce(value, function (result1, value1) {
          if (!isNull(value1) && !isUndefined(value1)) {
            result1 += `${key}=${value1}&`
            return result1
          } else {
            return result1
          }
        }, '')
      } else {
        result += `${key}=${value}&`
      }
      return result
    } else {
      return result
    }
  }, '').slice(0, -1)
  return qs
}

export function parseSearchQuery (query) {
  if (!query) return []
  const matches = query.split(' and ')
  // if (!matches || !matches.length) {
  //   if (query) return [{name: '_all', value: query}]
  //   return []
  // }

  return matches.map(m => {
    const res = m.match(/([^ ()]*)=(.*)/)
    if (!res || !res.length) return {name: '_all', value: m}
    return {
      name: res[1],
      value: res[2]
    }
  })
}

export function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

export function convertSearchParams (params) {
  const p = assign({}, params)
  if (p.dateFrom) p.dateFrom = moment(p.dateFrom, dateFormat).startOf('day').valueOf()
  if (p.dateTo) p.dateTo = moment(p.dateTo, dateFormat).endOf('day').valueOf()
  return p
}

export const collections = [
  {label: 'incident', value: 'incident'},
  {label: 'event', value: 'event'}
]
export const severities = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
  { label: 'Audit', value: 'AUDIT' },
  { label: 'Device', value: 'DEVICE' },
  { label: 'Ignore', value: 'IGNORE' }
]

export const viewFilters = {
  standard: {
    name: 'Standard',
    desc: 'Normal view'
  },
  log: {
    name: 'Log',
    desc: 'Log file content view'
  },
  raw: {
    name: 'Raw',
    desc: 'Raw data view'
  },
  notNull: {
    name: 'Not Null',
    desc: 'Filter Null Values'
  }
}

export const WorkflowActionTypes = [{
  label: 'Open Incident',
  value: 'OPEN_INCIDENT'
}, {
  label: 'Add Tag',
  value: 'ADD_TAG'
}]

export const collectorOSTypes = [{
  label: 'Windows', value: 'WINDOWS'
}, {
  label: 'Linux', value: 'LINUX'
}]

export const isWindowsDevice = (device) => {
  return device && device.templateName === 'Windows Server'
}

export const roleOptions = [
  {value: 'ADMIN', label: 'Admin'},
  {value: 'USER', label: 'User'}
]

export const gaugeTypes = [{
  label: 'Line', value: 'line'
}, {
  label: 'Bar', value: 'bar'
}, {
  label: 'Liquid', value: 'liquid'
}, {
  label: 'Accel', value: 'accel'
}, {
  label: 'Incident Table', value: 'table'
}]

export const gaugeDurationTypes = [{
  label: 'Hours', value: 'hour'
}, {
  label: 'Days', value: 'day'
}, {
  label: 'Months', value: 'month'
}]

export const gaugeResources = [{
  label: 'Search', value: 'search'
}, {
  label: 'Monitor', value: 'monitor'
}, {
  label: 'Incident', value: 'incident'
}]

export const timingOptions = [{
  label: 'Realtime', value: 'realtime',
}, {
  label: 'Historic', value: 'historic'
}]

export const realtimeGauges = [{
  label: 'Liquid', value: 'liquid'
}, {
  label: 'Accelerometer', value: 'accel'
}]

export const historicGauges = [{
  label: 'Line Chart', value: 'line'
}, {
  label: 'Bar Chart', value: 'bar'
}]

export const gaugeSizeList = ['small', 'medium', 'big', 'very big']

export function filterDevices (devices) {
  return (devices || []).filter(p => p.templateName !== 'Long hub' && p.templateName !== 'Free Text' && !p.line)
}

export function filterGaugeServers (devices) {
  return (devices || []).filter(p => p.templateName !== 'Long hub' && p.templateName !== 'Free Text' && !p.line)
}

export const layoutWidthZoom  = 100
export const layoutHeightZoom = 4
export const layoutCols = {lg: 12 * layoutWidthZoom, md: 12 * layoutWidthZoom, sm: 10 * layoutWidthZoom, xs: 4 * layoutWidthZoom, xxs: 4 * layoutWidthZoom}
export const layoutRowHeight = 10

export function getWidgetSize (gauge, devices, flip) {
  let size = gauge.gaugeSize
  // let hs = 0
  // if (gauge.templateName === 'Servers') {
  //   const count = !gauge.servers || !gauge.servers.length ? filterGaugeServers(devices || []).length : gauge.servers.length
  //   const ws = Math.max(Math.min(Math.ceil(count / (gauge.itemSize === 'slim' ? 24 : 16)), 3), 1)
  //   if (ws === 1) size = 'big'
  //   else if (ws === 2) size = 'very big'
  //   else size = 'extra big'
  //
  //   hs = Math.max(1, count / ws /  (gauge.itemSize === 'slim' ? 6 : 4))
  // }
  // if (flip) {
  //   if (size === 'small' || size === 'medium' || size === 'custom') size = 'big'
  //   if (gauge.templateName === 'Servers') size = 'very big'
  // }
  if (gauge.minimized) size = 'very small'

  let wh = {w: 4, h: 4}
  switch(size) {
    case 'very small':
      wh = {w: 1, h: 1}
      break
    case 'small':
      wh = {w: 1, h: 2}
      break
    case 'medium':
      wh = {w: 2, h: 2}
      break
    case 'very big':
      wh = {w: 8, h: 4}
      break
    case 'extra big':
      wh = {w: 12, h: 4}
      break
    case 'custom':
      wh = {w: 0, h: 0}
      break
    case 'big':
    default:
      wh = {w: 4, h: 4}
  }

  if (flip) {
    // if (gauge.templateName === 'Servers') wh.h = 6
  } else {
    // if (hs) wh.h = hs

    if (gauge.templateName === 'Accelerometer')
      wh.h = 1
  }

  return {
    w: wh.w * layoutWidthZoom,
    h: wh.h * layoutHeightZoom,
    minH: 1 * layoutHeightZoom + 2,
    minW: 1 * layoutWidthZoom
  }
}

export const gaugeAspectRatio = {
  // 'Liquid': {w: 1, h: 1}
}

export const gaugeTableViewModes = [{
  label: 'JSON', value: 'json'
}, {
  label: 'Table', value: 'table'
}]


export const appletColors = '#2468ff #963484 #222629 #3cba54 #999999 #D1282C'.split(' ')

export function cybertronImageUrl (item) {
  return `${cybertronUrl}/webPic?articleId=${item.contentId}`
}

export function cybertronRenderInfo (item) {
  let imgUrl, desc, date

  if (item.type === 'rss') {
    imgUrl = item.pictureURL
  } else if (item.type === 'video') {
    imgUrl = `http://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`
  } else {
    imgUrl = `${cybertronUrl}/mobileGetPic?pictureName=${item.pictureName || ''}`
  }

  if (item.type === 'video') {
    desc = item.channel
    date = `${moment(new Date(item.dateCreated)).fromNow()} • ${item.views}`
  } else {
    desc = item.readableContent
    date = moment(new Date(item.dateCreated)).fromNow()
  }

  return {imgUrl, desc, date}
}


import React from 'react'
import { findIndex, startsWith } from 'lodash'
import ReactTooltip from 'react-tooltip'

import SidebarContainer from 'containers/sidebar/SidebarContainer'
import Dashboard from './dashboard/Dashboard'
import ActivationModal from 'components/auth/ActivationModal'
import { scrollTop } from 'util/Scroll'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import BigIncidents from 'components/dashboard/main_incidents_table/BigIncidents'

import Alert from 'components/common/Alert'
import Snackbar from 'components/common/Snackbar'

import { mainMenu, deviceMenu, contentType } from './sidebar/Config'
import {sidebarWidth} from 'style/common/materialStyles'

const dashboardId = mainMenu[0].id

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // minHeight: 1300
    }
  }

  componentWillMount () {
    this.props.fetchEnvVars()
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.envVarAvailable && !this.props.envVarAvailable) {
      const index = findIndex(nextProps.envVars, {envvars: {key: 'CUSTOMER_ID'}})
      const customerId = index >= 0 ? nextProps.envVars[index].envvars.key : null

      const licenseIndex = findIndex(nextProps.envVars, {envvars: {key: 'CUSTOMER_LICENSE_RESPONSE'}})
      const license = licenseIndex >= 0 ? nextProps.envVars[licenseIndex].envvars.key : null
      if (!customerId || !license) {
        // User is not activated yet.
        this.props.openActivationModal()
      }
    }
  }

  isBigIncidents () {
    const {pathname, search} = this.props.location
    return (pathname === '/' && search === '?bigincidents=')
  }
  renderDashboard () {
    return (
      <Dashboard {...this.props}/>
    )
  }

  renderBigIncidents () {
    if (this.isBigIncidents()) {
      return (
        <BigIncidents {...this.props}/>
      )
    }
  }

  onClickMenuItem (type, item) {
    const { history, closeDevice } = this.props

    scrollTop(this.refs.content)

    if (item.id === 'dashboard') {
      closeDevice()
    }
    history.push({
      pathname: item.path,
      search: item.search || ''
    })
  }

  renderSidebar () {
    const {location, device, history} = this.props
    const {pathname} = location

    let pageId = dashboardId
    let pageType = contentType.Main

    let found = false
    mainMenu.forEach(item => {
      if (item.id === dashboardId) return true
      const matched = pathname === '/' ?
        (item.path === pathname && (location.search || '') === (item.search || '')) :
        pathname === item.path
      if (matched) {
        pageId = item.id
        pageType = contentType.Main
        found = true
        return false
      }
    })

    if (!found) {
      let deviceId = device ? device.id : 'main'
      deviceMenu(deviceId).forEach(item => {
        if (item.id === dashboardId) return true
        if (startsWith(pathname, item.path)) {
          pageId = item.id
          pageType = contentType.Device
          found = true
          return false
        }
      })
    }

    return (
      <SidebarContainer
        history={history}
        pageId={pageId}
        pageType={pageType}
        device={device}
        onClickItem={this.onClickMenuItem.bind(this)}
      />
    )
  }

  onCloseAlert () {
    this.props.closeApiErrorModal()
  }

  renderActivationModal () {
    if (!this.props.activationModalOpen) return null
    return (
      <ActivationModal {...this.props}/>
    )
  }

  renderApiError () {
    if (!this.props.apiErrorModalOpen) return null
    const {apiError} = this.props
    const msg = `${apiError.message}. Url: ${apiError.config ? apiError.config.url : ''}`
    return (
      <Alert message={msg} onClose={this.onCloseAlert.bind(this)}/>
    )
  }

  render () {
    const {children} = this.props
    const {minHeight} = this.state

    let style = {}
    if (!children) style = {minHeight: `${minHeight}px`}

    return (
      <div style={style}>
        {this.renderSidebar()}
        <div className="page-content flex-vertical" style={{overflow: 'auto', paddingLeft: sidebarWidth}} ref="content">
          {this.renderDashboard()}
          {this.renderBigIncidents()}
          {children || null}
        </div>
        <ReactTooltip />
        <Snackbar {...this.props}/>
        {this.renderActivationModal()}
        {this.renderApiError()}
      </div>
    )
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Main)

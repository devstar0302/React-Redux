import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import SearchIcon from 'material-ui/svg-icons/action/search'
import { assign } from 'lodash'

import { parseSearchQuery, severities } from 'shared/Global'

const searchIconStyle = {
  marginTop: '6px'
}

export default class IncidentSnackbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.onClickAlert = this.onClickAlert.bind(this)

    this.searchIcon = <SearchIcon color="white" style={searchIconStyle}/>
    this.onSnackClose = this.onSnackClose.bind(this)
  }
  onSnackClose (reason) {
    // console.log(reason)
  }
  onClickAlert () {
    const {incident} = this.props.newIncidentMsg
    const query = (incident.description || '').replace(/:/gi, '')
    const newChips = parseSearchQuery(query)
    if (incident.devicename) {
      newChips.push({
        name: 'devicename',
        value: incident.devicename
      })
    }
    this.props.history.push('/search')
    this.props.updateQueryChips(newChips)
    this.props.updateSearchParams(assign({}, this.props.searchParams, {
      query: newChips.map(m => `${m.name}=${m.value}`).join(' and '),
      severity: severities.map(p => p.value).join(',')
    }), this.props.history)
  }
  render () {
    const { newIncidentMsg } = this.props
    if (!newIncidentMsg) return null
    // const keep = userInfo && userInfo.keepIncidentAlert
    return (
      <div className="link" onClick={this.onClickAlert}>
        <Snackbar
          open
          action={this.searchIcon}
          message={newIncidentMsg.message}
          autoHideDuration={3600000 * 24 * 7}
          onActionTouchTap={this.onClickAlert}
          onRequestClose={this.onSnackClose}
        />
        <span className="hidden">{newIncidentMsg.incident.id}</span>
      </div>
    )
  }
}

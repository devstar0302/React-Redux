import React from 'react'
import { Route } from 'react-router-dom'
import { Switch, withRouter } from 'react-router'

import DeviceMainIncidentsContainer from 'containers/device/main/incidents/MainIncidentsContainer'
import DeviceMainWorkflowsContainer from 'containers/device/main/workflows/MainWorkflowsContainer'
import DeviceMainAdvancedContainer from 'containers/device/main/advanced/MainAdvancedContainer'

class Main extends React.Component {
  render () {
    return (
      <Switch>
        <Route path="/device/:deviceId/main" exact component={DeviceMainIncidentsContainer}/>
        <Route path="/device/:deviceId/main/workflows" component={DeviceMainWorkflowsContainer}/>
        <Route path="/device/:deviceId/main/advanced" component={DeviceMainAdvancedContainer}/>
      </Switch>
    )
  }
}

export default withRouter(Main)

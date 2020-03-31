import React from 'react'
import { Switch } from 'react-router'
import { Route } from 'react-router-dom'

import SettingCollectors from 'containers/settings/collector/CollectorsContainer'
import SettingAgentsContainer from 'containers/settings/agent/AgentsContainer'

export default class CollectorRoutes extends React.Component {
  render () {
    return (
      <Switch>
        <Route path="/settings/collectors" exact component={SettingCollectors} />
        <Route path="/settings/collectors/agents" component={SettingAgentsContainer} />
      </Switch>
    )
  }
}

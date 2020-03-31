import React from 'react'

import { appendComponent, removeComponent } from 'util/Component'
import IncidentDetailModal from './IncidentDetailModal'
import CommentsModalContainer from 'containers/shared/incident/CommentsModalContainer'
import IncidentEventsModal from './IncidentEventsModal'

export function showIncidentDetail (incident) {
  appendComponent(
    <IncidentDetailModal incident={incident} onClose={removeComponent}/>
  )
}

export function showIncidentRaw (incident) {
  appendComponent(
    <IncidentEventsModal
      incident={incident}
      onClose={(modal) => {
        removeComponent(modal)
      }}
    />
  )
}

export function showIncidentComments (sid, incident, cb, updateDeviceIncident) {
  appendComponent(
    <CommentsModalContainer
      incident={incident}
      updateDeviceIncident={updateDeviceIncident}
      onClose={(modal) => {
        removeComponent(modal)
        cb && cb()
      }}
    />
  )
}

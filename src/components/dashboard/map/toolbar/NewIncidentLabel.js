import React from 'react'
import IconButton from 'material-ui/IconButton'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'

const buttonStyle = {
  padding: '4px',
  width: 50,
  height: 50
}

const iconStyle = {
  width: 30,
  height: 30
}

const NewIncidentLabel = ({onNewIncident}) => (
  <li>
    <IconButton
      style={buttonStyle}
      iconStyle={iconStyle}
      onTouchTap={onNewIncident}>
        <AddCircleIcon color="#545454"/>
    </IconButton>
  </li>
)

export default NewIncidentLabel

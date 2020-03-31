import React from 'react'
import FlatButton from 'material-ui/FlatButton'

const style = {
  width: '100%',
  color: '#7c7c7e'
}

const labelStyle = {
  paddingLeft: '10px'
}

const Metric = ({icon, value, title, onClick}) => (
  <FlatButton
    label={<span><span className="incident-button-value">{value}</span><span>{title}</span></span>}
    labelPosition="before"
    labelStyle={labelStyle}
    onTouchTap={onClick}
    icon={icon}
    style={style}
  />
)

export default Metric

import React from 'react'
import { subHeaderStyle } from 'style/common/materialStyles'

const SubHeader = ({name}) => (
  <div style={subHeaderStyle}>
    {name}
  </div>
)

export default SubHeader

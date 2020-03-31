import React from 'react'
import { headerStyle } from 'style/common/materialStyles'

const Header = ({name}) => (
  <div className="modal-header" style={headerStyle}>
    <h3 className="modal-title">{name}</h3>
  </div>
)

export default Header

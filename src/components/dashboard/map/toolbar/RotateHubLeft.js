import React from 'react'

const RotateHubLeft = ({ hub }) => (
  <li>
    <div className="option p-none link" style={{display: hub ? 'block' : 'none'}}>
      <i className="fa fa-rotate-left" title="Rotate Left" />
    </div>
  </li>
)

export default RotateHubLeft

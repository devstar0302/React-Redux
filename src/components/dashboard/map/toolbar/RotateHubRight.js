import React from 'react'

const RotateHubRight = ({ hub }) => (
  <li>
    <div className="option p-none link" style={{display: hub ? 'block' : 'none'}}>
      <i className="fa fa-rotate-right" title="Rotate Right" />
    </div>
  </li>
)

export default RotateHubRight

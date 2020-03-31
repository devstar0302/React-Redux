import React from 'react'

const LineWidthInc = ({ lineGroup, onLineWidthInc }) => (
  <li>
    <div className="option p-none link"
      style={{display: lineGroup ? 'block' : 'none'}}
      onClick={onLineWidthInc}
    >
      <i className="fa fa-expand" title="Increase Line Width" />
    </div>
  </li>
)

export default LineWidthInc

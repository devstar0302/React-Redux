import React from 'react'

const LineWidthDec = ({ lineGroup, onLineWidthDec }) => (
  <li>
    <div className="option p-none link"
      style={{display: lineGroup ? 'block' : 'none'}}
      onClick={onLineWidthDec}
    >
      <i className="fa fa-expand" title="Decrease Line Width" />
    </div>
  </li>
)

export default LineWidthDec

import React from 'react'
import BaseObject from './BaseObject'

class DEllipse extends BaseObject {
  render () {
    const { x, y, w, h, name, listeners } = this.props

    return (
      <g style={{visibility: 'visible', cursor: 'move'}}>
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="#ffffff" stroke="#000000" pointerEvents="all" {...listeners}/>
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" pointerEvents="none">{name}</text>
      </g>
    )
  }
}

export default DEllipse

import React from 'react'
import BaseObject from './BaseObject'

class DRect extends BaseObject {
  render () {
    const { x, y, w, h, name, listeners } = this.props

    return (
      <g style={{visibility: 'visible', cursor: 'move'}}>
        <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke="#000000" pointerEvents="all" {...listeners}/>
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" pointerEvents="none">{name}</text>
      </g>
    )
  }
}

export default DRect

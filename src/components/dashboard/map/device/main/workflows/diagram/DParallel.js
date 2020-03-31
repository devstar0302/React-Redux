import React from 'react'
import BaseObject from './BaseObject'

class DParallel extends BaseObject {
  render () {
    const { x, y, w, h, name, listeners } = this.props

    return (
      <g style={{visibility: 'visible', cursor: 'move'}}>
        <path d={`M ${x + w * 0.24} ${y} L ${x} ${y + h} L ${x + w * 0.76} ${y + h} L ${x + w} ${y} Z`} stroke="#000000"
          fill="#ffffff" strokeMiterlimit="10" pointerEvents="all" {...listeners}/>
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" pointerEvents="none">{name}</text>
      </g>
    )
  }
}

export default DParallel

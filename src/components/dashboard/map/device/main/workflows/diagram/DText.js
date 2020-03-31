import React from 'react'

class DText extends React.Component {
  render () {
    const { x, y, w, h, name, listeners } = this.props

    return (
      <g style={{visibility: 'visible', cursor: 'move'}}>
        <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" pointerEvents="all" {...listeners}>{name}</text>
      </g>
    )
  }
}

export default DText

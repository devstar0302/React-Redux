import React from 'react'

import DRect from './diagram/DRect'
import DEllipse from './diagram/DEllipse'
import DDiamond from './diagram/DDiamond'
import DParallel from './diagram/DParallel'
import DTriangle from './diagram/DTriangle'
import DText from './diagram/DText'

export const workflowItems = [{
  title: 'Rectangle',
  component: DRect,
  img: <g key="1"><g /><g><g transform="translate(0.5,0.5)"><rect x="2" y="10" width="31" height="16" fill="#ffffff" stroke="#000000"/></g></g><g/><g/></g>,
  connectionPoints: 12,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const p = [
      {x: 0.25, y: 0},
      {x: 0.5, y: 0},
      {x: 0.75, y: 0},
      {x: 0, y: 0.25},
      {x: 1, y: 0.25},
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0, y: 0.75},
      {x: 1, y: 0.75},
      {x: 0.25, y: 1},
      {x: 0.5, y: 1},
      {x: 0.75, y: 1}
    ]
    return {
      x: x + w * p[point].x,
      y: y + h * p[point].y
    }
  },
  isTopPoint: (point) => {
    return point === 0 || point === 1 || point === 2
  },
  isLeftPoint: (point) => {
    return point === 3 || point === 5 || point === 7
  },
  isRightPoint: (point) => {
    return point === 4 || point === 6 || point === 8
  },
  isBottomPoint: (point) => {
    return point === 9 || point === 10 || point === 11
  }
}, {
  title: 'Diamond',
  component: DDiamond,
  img: <g key="4"><g /><g><g transform="translate(0.5,0.5)"><path d="M 18 2 L 34 18 L 18 34 L 2 18 Z" fill="#ffffff" stroke="#000000" strokeMiterlimit="10"/></g></g><g/><g/></g>,
  connectionPoints: 8,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const p = [
      {x: 0.5, y: 0},
      {x: 0.25, y: 0.25},
      {x: 0.75, y: 0.25},
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0.25, y: 0.75},
      {x: 0.75, y: 0.75},
      {x: 0.5, y: 1}
    ]
    return {
      x: x + w * p[point].x,
      y: y + h * p[point].y
    }
  },
  isTopPoint: (point) => {
    return point === 0 || point === 1 || point === 2
  },
  isLeftPoint: (point) => {
    return point === 1 || point === 3 || point === 5
  },
  isRightPoint: (point) => {
    return point === 2 || point === 4 || point === 6
  },
  isBottomPoint: (point) => {
    return point === 5 || point === 6 || point === 7
  }
}, {
  title: 'Ellipse',
  component: DEllipse,
  img: <g key="3"><g /><g><g transform="translate(0.5,0.5)"><ellipse cx="18" cy="18" rx="15.6" ry="10.4" fill="#ffffff" stroke="#000000"/></g></g><g/><g/></g>,
  connectionPoints: 8,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const angles = [270, 45, 135, 180, 0, 315, 225, 90]
    const rad = 2 * Math.PI * 45 * angles[point] / 360
    return {
      x: x + w * (1 + Math.cos(rad)) / 2,
      y: y + h * (1 + Math.sin(rad)) / 2
    }
  },
  isTopPoint: (point) => {
    return point === 0 || point === 1 || point === 2
  },
  isLeftPoint: (point) => {
    return point === 1 || point === 3 || point === 5
  },
  isRightPoint: (point) => {
    return point === 2 || point === 4 || point === 6
  },
  isBottomPoint: (point) => {
    return point === 5 || point === 6 || point === 7
  }
}, {
  title: 'Parallelogram',
  component: DParallel,
  img: <g key="5"><g /><g><g transform="translate(0.5,0.5)"><path d="M 2 26 L 9 10 L 34 10 L 27 26 Z" fill="#ffffff" stroke="#000000" strokeMiterlimit="10"/></g></g><g/><g/></g>,
  connectionPoints: 12,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const p = [
      {x: 0.25, y: 0},
      {x: 0.5, y: 0},
      {x: 0.75, y: 0},
      {x: 0, y: 0.25},
      {x: 1, y: 0.25},
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0, y: 0.75},
      {x: 1, y: 0.75},
      {x: 0.25, y: 1},
      {x: 0.5, y: 1},
      {x: 0.75, y: 1}
    ]
    return {
      x: x + w * p[point].x,
      y: y + h * p[point].y
    }
  },
  isTopPoint: (point) => {
    return point === 0 || point === 1 || point === 2
  },
  isLeftPoint: (point) => {
    return point === 3 || point === 5 || point === 7
  },
  isRightPoint: (point) => {
    return point === 4 || point === 6 || point === 8
  },
  isBottomPoint: (point) => {
    return point === 9 || point === 10 || point === 11
  }
}, {
  title: 'Triangle',
  component: DTriangle,
  img: <g key="6"><g /><g><g transform="translate(0.5,0.5)"><path d="M 6 2 L 30 18 L 6 34 Z" fill="#ffffff" stroke="#000000" strokeMiterlimit="10"/></g></g><g/><g/></g>,
  connectionPoints: 6,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const p = [
      {x: 0, y: 0.25},
      {x: 0.5, y: 0.25},
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0, y: 0.75},
      {x: 0.5, y: 0.75}
    ]
    return {
      x: x + w * p[point].x,
      y: y + h * p[point].y
    }
  },
  isTopPoint: (point) => {
    return point === 1
  },
  isLeftPoint: (point) => {
    return point === 0 || point === 2 || point === 4
  },
  isRightPoint: (point) => {
    return point === 3
  },
  isBottomPoint: (point) => {
    return point === 5
  }
}, {
  title: 'Text',
  component: DText,
  img: <g key="1"><g><text x="18" y="18" textAnchor="middle" dominantBaseline="central" fontSize="12">Text</text></g></g>,
  connectionPoints: 12,
  getConnectionPoint: (object, point) => {
    const { x, y, w, h } = object
    const p = [
      {x: 0.25, y: 0},
      {x: 0.5, y: 0},
      {x: 0.75, y: 0},
      {x: 0, y: 0.25},
      {x: 1, y: 0.25},
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0, y: 0.75},
      {x: 1, y: 0.75},
      {x: 0.25, y: 1},
      {x: 0.5, y: 1},
      {x: 0.75, y: 1}
    ]
    return {
      x: x + w * p[point].x,
      y: y + h * p[point].y
    }
  },
  isTopPoint: (point) => {
    return point === 0 || point === 1 || point === 2
  },
  isLeftPoint: (point) => {
    return point === 3 || point === 5 || point === 7
  },
  isRightPoint: (point) => {
    return point === 4 || point === 6 || point === 8
  },
  isBottomPoint: (point) => {
    return point === 9 || point === 10 || point === 11
  }
}]

export const handlePoints = [
  {x: 0, y: 0, cursor: 'nw-resize'},
  {x: 0.5, y: 0, cursor: 'n-resize'},
  {x: 1, y: 0, cursor: 'ne-resize'},
  {x: 0, y: 0.5, cursor: 'w-resize'},
  {x: 1, y: 0.5, cursor: 'e-resize'},
  {x: 0, y: 1, cursor: 'sw-resize'},
  {x: 0.5, y: 1, cursor: 's-resize'},
  {x: 1, y: 1, cursor: 'se-resize'}
]

import React from 'react'

const eventNames = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  }
}

function getEventClientTouchOffset (e) {
  if (e.targetTouches.length === 1) {
    return getEventClientOffset(e.targetTouches[0])
  }
}

function getEventClientOffset (e) {
  if (e.targetTouches) {
    return getEventClientTouchOffset(e)
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    }
  }
}

export default class DividerLine extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dragging: false
    }

    this.listenerTypes = ['mouse', 'touch']

    this._mouseClientOffset = {}

    this.handleTopMoveStart = this.handleTopMoveStart.bind(this)
    this.handleTopMoveCapture = this.handleTopMoveCapture.bind(this)
    this.handleTopMoveEndCapture = this.handleTopMoveEndCapture.bind(this)
  }

  componentDidMount () {
    this.setup(this.refs.divider)
  }

  componentWillUnmount () {
    this.teardown(this.refs.divider)
  }

  setup (node) {
    if (typeof node === 'undefined') {
      return
    }

    this.addEventListener(node, 'start', this.handleTopMoveStart, true)
    this.addEventListener(window, 'move', this.handleTopMoveCapture, true)
    this.addEventListener(window, 'end', this.handleTopMoveEndCapture, true)
  }

  teardown (node) {
    if (typeof node === 'undefined') {
      return
    }

    this.removeEventListener(node, 'start', this.handleTopMoveStart)
    this.removeEventListener(window, 'move', this.handleTopMoveCapture, true)
    this.removeEventListener(window, 'end', this.handleTopMoveEndCapture, true)
  }

  addEventListener (subject, event, handler, capture) {
    this.listenerTypes.forEach(function (listenerType) {
      subject.addEventListener(eventNames[listenerType][event], handler, capture)
    })
  }

  removeEventListener (subject, event, handler, capture) {
    this.listenerTypes.forEach(function (listenerType) {
      subject.removeEventListener(eventNames[listenerType][event], handler, capture)
    })
  }

  handleTopMoveStart (e) {
    const clientOffset = getEventClientOffset(e)
    if (clientOffset) {
      this._mouseClientOffset = clientOffset
    }
    this.setState({dragging: true})
  }

  handleTopMoveCapture (e) {
    if (!this.state.dragging) return
    e.preventDefault()
    const clientOffset = getEventClientOffset(e)
    if (clientOffset) {
      if (this._mouseClientOffset) {
        const diff = clientOffset.y - this._mouseClientOffset.y
        const {onDragMove} = this.props
        onDragMove && onDragMove(diff)
      }

      this._mouseClientOffset = clientOffset
    }
  }

  handleTopMoveEndCapture (e) {
    if (!this.state.dragging) return
    e.preventDefault()
    this.setState({dragging: false})
    const {onDragEnd} = this.props
    onDragEnd && onDragEnd()
  }

  render () {
    const style = {
      position: 'absolute',
      width: '100%',
      height: '10px',
      cursor: 'row-resize',
      bottom: 0,
      zIndex: 60,
      borderBottom: '1px solid #E91E63'
    }

    return (
      <div style={style} ref="divider" />
    )
  }
}

DividerLine.defaultProps = {
  onDragMove: null,
  onDragEnd: null
}

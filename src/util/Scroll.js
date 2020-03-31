import ReactDOM from 'react-dom'

export function scrollBottom (ref) {
  let el = ReactDOM.findDOMNode(ref)
  if (!el) return
  el.scrollTop = el.scrollHeight
}

export function scrollTop (ref) {
  let el = ReactDOM.findDOMNode(ref)
  if (!el) return
  el.scrollTop = 0
}

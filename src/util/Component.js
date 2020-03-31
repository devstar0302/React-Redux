import ReactDOM from 'react-dom'
import { modalDiv } from './GetDiv'

export function appendComponent (component) {
  document.body.appendChild(modalDiv)
  let instance = ReactDOM.render(component, modalDiv)
  return instance
}

export function removeComponent (component) {
  if (!component) {
    console.error('Missing component to remove.')
    return
  }
  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(modalDiv)
    modalDiv.parentNode && modalDiv.parentNode.removeChild(modalDiv)
  }, 1)
}

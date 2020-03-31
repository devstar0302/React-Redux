import React from 'react'
import ReactDOM from 'react-dom'

import { Modal } from 'components/modal/parts'

export default class DetailLogModalView extends React.Component {
  onRefRow (ref) {
    setTimeout(() => {
      const node = ReactDOM.findDOMNode(ref)
      node && node.scrollIntoView({behavior: 'smooth'})
    }, 100)
  }
  renderTable () {
    const list = this.props.items
    const {rowId} = this.props

    return (
      <div className="bg-white">
        {list.map((row, index) =>
          <div key={row.id} className={row.id === rowId ? 'highlight' : ''} ref={row.id === rowId ? this.onRefRow.bind(this) : null}>
            <div dangerouslySetInnerHTML={{__html: row.entity && row.entity.dataobj ? row.entity.dataobj.line : ' '}}/>
          </div>
        )}
      </div>
    )
  }

  render () {
    const {onHide} = this.props
    return (
      <Modal title="Log" onRequestClose={onHide} contentStyle={{width: '90%', maxWidth: 'initial'}}>
        {this.renderTable()}
      </Modal>
    )
  }
}

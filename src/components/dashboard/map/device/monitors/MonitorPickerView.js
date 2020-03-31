import React, { Component } from 'react'

import {Modal, CardPanel} from 'components/modal/parts'

export default class MonitorPickerView extends Component {
  render () {
    const {onHide, monitorTemplates, onClickItem, extImageBaseUrl} = this.props
    return (
      <Modal title="Choose Monitor" onRequestClose={onHide}>
        <CardPanel>
          <div className="monitor-types text-center">
            <ul>
              {
                monitorTemplates.map(item =>
                  <li key={item.id} className="link" onClick={onClickItem.bind(this, item)}>
                    <img src={`${extImageBaseUrl}${item.image}`} style={{background: 'black', borderRadius: '3px'}} alt=""/>
                    <span>{item.name}</span>
                  </li>
                )
              }
            </ul>
          </div>
        </CardPanel>
      </Modal>
    )
  }
}
